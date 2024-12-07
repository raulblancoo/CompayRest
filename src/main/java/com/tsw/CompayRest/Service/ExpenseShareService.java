package com.tsw.CompayRest.Service;

import com.tsw.CompayRest.Dto.ExpenseShareDto;
import com.tsw.CompayRest.Dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public interface ExpenseShareService {
    ExpenseShareDto save(Long expenseId, String userEmail, Double amount);
    boolean deleteAll(Long expenseId);
}
