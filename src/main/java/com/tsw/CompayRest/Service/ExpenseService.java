package com.tsw.CompayRest.Service;

import com.tsw.CompayRest.Dto.ExpenseDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface ExpenseService {
    ExpenseDto saveExpense(ExpenseDto expense);
    Optional<ExpenseDto> updateExpense(Long expenseId,ExpenseDto updatedExpense);
    boolean deleteExpense(Long expenseId);
    List<ExpenseDto> getAllExpenses();
    List<ExpenseDto> getAllExpensesByGroupId(Long groupId);
    Optional<ExpenseDto> getExpenseById(Long expenseId);
}
