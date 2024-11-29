package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.ExpenseDto;
import com.tsw.CompayRest.Mapper.ExpenseMapper;
import com.tsw.CompayRest.Repository.ExpenseRepository;
import com.tsw.CompayRest.Service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;


    @Override
    public ExpenseDto saveExpense(ExpenseDto expense) {
        expenseRepository.save(expenseMapper.toEntity(expense));
        return expense;
    }

    @Override
    public Optional<ExpenseDto> updateExpense(Long expenseId, ExpenseDto updatedExpense) {
        return Optional.empty();
    }

    @Override
    public boolean deleteExpense(Long expenseId) {
        return expenseRepository.findById(expenseId).map(expense -> {
            expenseRepository.delete(expense);
            return true;
        }).orElse(false);
    }

    @Override
    public List<ExpenseDto> getAllExpenses() {
        return expenseMapper.toListDto(expenseRepository.findAll());
    }

    @Override
    public Optional<ExpenseDto> getExpenseById(Long expenseId) {
        return expenseRepository.findById(expenseId).map(expenseMapper::toDto);
    }
}