package com.tsw.CompayRest.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BizumDto {
    private UserDto loan_user;
    private UserDto payer_user;
    private double amount;
}
