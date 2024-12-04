package com.tsw.CompayRest.Dto;

import lombok.Data;

import java.util.List;

@Data
public class NewGroupDto {
    private String group_name;
    private String currency;
    private double amount;
    private String imgURL;
    private List<String> userEmails;
}
