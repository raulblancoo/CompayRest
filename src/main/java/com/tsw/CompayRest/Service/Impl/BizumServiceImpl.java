package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.BizumDto;
import com.tsw.CompayRest.Dto.ExpenseDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.BizumService;
import com.tsw.CompayRest.Service.ExpenseService;
import com.tsw.CompayRest.Service.ExpenseShareService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class BizumServiceImpl implements BizumService {

    private final ExpenseService expenseService;
    private final ExpenseShareService expenseShareService;

    public BizumServiceImpl(ExpenseService expenseService, ExpenseShareService expenseShareService) {
        this.expenseService = expenseService;
        this.expenseShareService = expenseShareService;
    }

    @Override
    public List<BizumDto> findBizumsByGroupId(Long groupId) {
        // Calcula balances directamente y evita asignaciones innecesarias
        Map<UserDto, Double> balanceMap = calculateBalances(groupId);

        PriorityQueue<Map.Entry<UserDto, Double>> maxHeap = new PriorityQueue<>(
                Comparator.<Map.Entry<UserDto, Double>>comparingDouble(Map.Entry::getValue).reversed()
        );
        PriorityQueue<Map.Entry<UserDto, Double>> minHeap = new PriorityQueue<>(
                Comparator.comparingDouble(Map.Entry::getValue)
        );

        // Poblar heaps, filtrar y procesar en un solo paso
        balanceMap.entrySet().stream().forEach(entry -> {
            if (entry.getValue() > 0) maxHeap.add(entry);
            else if (entry.getValue() < 0) minHeap.add(entry);
        });

        List<BizumDto> bizumsTransactions = new ArrayList<>();

        while (!minHeap.isEmpty() && !maxHeap.isEmpty()) {
            Map.Entry<UserDto, Double> debtor = minHeap.poll();
            Map.Entry<UserDto, Double> creditor = maxHeap.poll();

            double amount = Math.min(-debtor.getValue(), creditor.getValue());
            BigDecimal bdAmount = BigDecimal.valueOf(amount).setScale(2, RoundingMode.HALF_UP);
            amount = bdAmount.doubleValue();

            bizumsTransactions.add(new BizumDto(debtor.getKey(), creditor.getKey(), amount));

            // Actualizar valores en lugar de reinserciones costosas
            debtor.setValue(debtor.getValue() + amount);
            creditor.setValue(creditor.getValue() - amount);

            if (debtor.getValue() < 0) minHeap.add(debtor);
            if (creditor.getValue() > 0) maxHeap.add(creditor);
        }

        return bizumsTransactions;
    }

    private Map<UserDto, Double> calculateBalances(Long groupId) {
        Map<UserDto, Double> balances = new HashMap<>();

        List<ExpenseDto> expenses = expenseService.getAllExpensesByGroupId(groupId);

        // Procesar gastos y participaciones directamente
        expenses.forEach(expense -> {
            UserDto loaner = expense.getOrigin_user();
            expenseShareService.getExpenseShareByExpenseId(expense.getId()).forEach(share -> {
                UserDto payer = share.getDestiny_user();

                if (!loaner.equals(payer)) {
                    // Actualizar balances directamente
                    balances.merge(loaner, share.getAssignedAmount(), Double::sum);
                    balances.merge(payer, -share.getAssignedAmount(), Double::sum);
                }
            });
        });

        return balances;
    }
}
