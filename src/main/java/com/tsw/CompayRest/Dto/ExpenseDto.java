package com.tsw.CompayRest.Dto;

import com.tsw.CompayRest.Enum.ShareMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDto {
    private Long id;
    private double amount;
    private String expense_name;
    private LocalDateTime expense_date;
    private UserDto origin_user;
    private GroupDto group;
    private ShareMethod share_method;
    private List<ExpenseShareDto> shares;
}
