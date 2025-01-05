package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.BizumDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.BizumService;
import com.tsw.CompayRest.Service.ExpenseService;
import com.tsw.CompayRest.Service.ExpenseShareService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
        // Calcula balances y organiza usuarios según deudas y créditos
        Map<UserDto, Double> balances = calculateBalances(groupId);

        // Filtrar usuarios con deudas (negativo) y créditos (positivo)
        List<Map.Entry<UserDto, Double>> debtors = balances.entrySet().stream()
                .filter(entry -> entry.getValue() < 0)
                .collect(Collectors.toList());
        List<Map.Entry<UserDto, Double>> creditors = balances.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .collect(Collectors.toList());

        List<BizumDto> bizumsTransactions = new ArrayList<>();

        // Resolver las deudas
        for (Map.Entry<UserDto, Double> debtor : debtors) {
            double debt = -debtor.getValue();

            for (Iterator<Map.Entry<UserDto, Double>> it = creditors.iterator(); it.hasNext() && debt > 0; ) {
                Map.Entry<UserDto, Double> creditor = it.next();
                double credit = creditor.getValue();

                double amount = Math.min(debt, credit);
                BigDecimal roundedAmount = BigDecimal.valueOf(amount).setScale(2, RoundingMode.HALF_UP);

                // Agregar transacción Bizum
                bizumsTransactions.add(new BizumDto(creditor.getKey(), debtor.getKey(), roundedAmount.doubleValue()));

                // Actualizar las deudas y créditos
                debt -= amount;
                creditor.setValue(credit - amount);

                // Eliminar al acreedor si su crédito se agotó
                if (creditor.getValue() <= 0) it.remove();
            }

            // Detener si el deudor queda saldado
            if (debt <= 0) {
                debtor.setValue(0.0);
            }
        }

        return bizumsTransactions;
    }

    private Map<UserDto, Double> calculateBalances(Long groupId) {
        // Calcular balances de todos los usuarios en el grupo
        return expenseService.getAllExpensesByGroupId(groupId).stream()
                .flatMap(expense -> expenseShareService.getExpenseShareByExpenseId(expense.getId()).stream()
                        .flatMap(share -> Stream.of(
                                new AbstractMap.SimpleEntry<>(expense.getOrigin_user(), share.getAssignedAmount()),
                                new AbstractMap.SimpleEntry<>(share.getDestiny_user(), -share.getAssignedAmount())
                        )))
                .collect(Collectors.groupingBy(
                        AbstractMap.SimpleEntry::getKey,
                        Collectors.summingDouble(AbstractMap.SimpleEntry::getValue)
                ));
    }
}
