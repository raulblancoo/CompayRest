package com.tsw.CompayRest.Dto;

import com.tsw.CompayRest.Enum.ShareMethod;
import lombok.Data;

import java.util.Date;

@Data
public class ExpenseDto {
    private Long id;
    private double amount;
    private String expense_name;
    private Date expense_date;
    private Long originUserId;
    private Long groupId;
    private ShareMethod share_method;
}
