package com.tsw.CompayRest.Dto;

import com.tsw.CompayRest.Enum.ShareMethod;
import lombok.Data;

import java.util.Map;

@Data
public class NewExpenseDto {
    private double amount;
    private String expense_name;
    private Long originUserId;
    private ShareMethod share_method;
    private Map<String,Double> shares;
}
