package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.BizumDto;
import com.tsw.CompayRest.Dto.ExpenseDto;
import com.tsw.CompayRest.Dto.ExpenseShareDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Mapper.UserMapper;
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
    private final UserMapper userMapper;

    public BizumServiceImpl(ExpenseService expenseService, ExpenseShareService expenseShareService, UserMapper userMapper) {
        this.expenseService = expenseService;
        this.expenseShareService = expenseShareService;
        this.userMapper = userMapper;
    }

    @Override
    public List<BizumDto> findBizumsByGroupId(Long groupId) {
        Map<UserDto, Double> balanceMap = calculateBalances(groupId);
        PriorityQueue<Map.Entry<UserDto, Double>> maxHeap = new PriorityQueue<>(
                (a, b) -> Double.compare(b.getValue(), a.getValue())
        );
        PriorityQueue<Map.Entry<UserDto, Double>> minHeap = new PriorityQueue<>(
                Comparator.comparingDouble(Map.Entry::getValue)
        );

        // Poblar los heaps con los balances positivos y negativos
        for (Map.Entry<UserDto, Double> entry : balanceMap.entrySet()) {
            if (entry.getValue() < 0) {
                minHeap.add(entry);
            } else if (entry.getValue() > 0) {
                maxHeap.add(entry);
            }
        }

        List<BizumDto> bizumsTransactions = new ArrayList<>();

        while (!minHeap.isEmpty() && !maxHeap.isEmpty()) {
            Map.Entry<UserDto, Double> debtor = minHeap.poll();
            Map.Entry<UserDto, Double> creditor = maxHeap.poll();

            double amount = Math.min(-debtor.getValue(), creditor.getValue());
            BigDecimal bdAmount = new BigDecimal(amount).setScale(2, RoundingMode.HALF_UP);
            amount = bdAmount.doubleValue();
            BizumDto bizum = new BizumDto();
            bizum.setPayer_user(debtor.getKey());
            bizum.setLoan_user(creditor.getKey());
            bizum.setAmount(bdAmount.doubleValue());

            bizumsTransactions.add(bizum);

            debtor.setValue(debtor.getValue() + amount);
            creditor.setValue(creditor.getValue() - amount);

            // Reinsertar en los heaps si quedan saldos pendientes
            if (debtor.getValue() < 0) {
                minHeap.add(debtor);
            }
            if (creditor.getValue() > 0) {
                maxHeap.add(creditor);
            }
        }

        return bizumsTransactions;
    }

    private Map<UserDto, Double> calculateBalances(Long groupId) {
        Map<UserDto, Double> balances = new HashMap<>();

        List<ExpenseDto> expenses = expenseService.getAllExpensesByGroupId(groupId);

        for(ExpenseDto expense : expenses) {
            List<ExpenseShareDto> shares = expenseShareService.getExpenseShareByExpenseId(expense.getId());
            UserDto loaner = expense.getOrigin_user();
            for(ExpenseShareDto share : shares) {
                UserDto payer = share.getDestiny_user();

                // Omitimos los pagos que el prestador haga para si mismo
                if(!loaner.equals(payer)) {
                    // Actualizamos al prestador (sumamos la cantidad)
                    balances.put(loaner, balances.getOrDefault(loaner,0.0) + share.getAssignedAmount());
                    // Actualizamos al pagador (restamos la cantidad)
                    balances.put(payer, balances.getOrDefault(payer,0.0) - share.getAssignedAmount());
                }
            }
        }

        return balances;
    }
}
