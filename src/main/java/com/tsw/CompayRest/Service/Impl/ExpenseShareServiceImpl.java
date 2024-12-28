package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.*;
import com.tsw.CompayRest.Mapper.ExpenseShareMapper;
import com.tsw.CompayRest.Repository.ExpenseRepository;
import com.tsw.CompayRest.Repository.ExpenseShareRepository;
import com.tsw.CompayRest.Service.ExpenseService;
import com.tsw.CompayRest.Service.ExpenseShareService;
import com.tsw.CompayRest.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExpenseShareServiceImpl implements ExpenseShareService {

    private final ExpenseShareRepository expenseShareRepository;
    private final ExpenseShareMapper expenseShareMapper;
    private final ExpenseService expenseService;
    private final UserService userService;

    @Override
    public ExpenseShareDto save(Long expenseId, String userEmail, Double amount) {
        Optional<ExpenseDto> expense = expenseService.getExpenseById(expenseId);
        Optional<UserDto> user = userService.getUserByEmail(userEmail);
        ExpenseShareDto expenseShareDto = new ExpenseShareDto();

        if(expense.isPresent() && user.isPresent()) {
            expenseShareDto.setExpense(expense.get());
            expenseShareDto.setDestiny_user(user.get());
            expenseShareDto.setAssignedAmount(amount);

            return expenseShareMapper.toDto(expenseShareRepository.save(expenseShareMapper.toEntity(expenseShareDto)));
        }

        return expenseShareDto;
    }

    @Override
    @Transactional
    public boolean deleteAll(Long expenseId) {
        int deletedRows = expenseShareRepository.deleteAllByExpenseId(expenseId);
        return deletedRows > 0;
    }
}
