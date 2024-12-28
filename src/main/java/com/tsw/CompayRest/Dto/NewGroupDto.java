package com.tsw.CompayRest.Dto;

import lombok.Data;

import java.util.List;

@Data
public class NewGroupDto {
    private String group_name;
    private String currency;
    private List<String> userEmails;
}
