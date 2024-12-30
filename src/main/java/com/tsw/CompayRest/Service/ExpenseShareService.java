package com.tsw.CompayRest.Service;

import com.tsw.CompayRest.Dto.ExpenseShareDto;
import com.tsw.CompayRest.Dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExpenseShareService {
    ExpenseShareDto save(Long expenseId, String userEmail, Double amount);
    List<ExpenseShareDto> getExpenseShareByExpenseId(Long expenseId);
    boolean deleteAll(Long expenseId);
}
