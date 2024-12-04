package com.tsw.CompayRest.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseShareDto {
    private ExpenseDto expense;
    private UserDto destiny_user;
    private Double assignedAmount;
}
