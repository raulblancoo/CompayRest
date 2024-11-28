package com.tsw.CompayRest.Dto;

import lombok.Data;

import java.util.Set;

@Data
public class GroupDto {
    private Long id;
    private String group_name;
    private String currency;
    private double amount;
    private String imgURL;
//    private Set<UserDto> users;
}
