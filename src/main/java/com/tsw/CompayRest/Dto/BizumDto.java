package com.tsw.CompayRest.Dto;

import lombok.Data;

@Data
public class BizumDto {
    private UserDto loan_user;
    private UserDto payer_user;
    private double amount;
}
