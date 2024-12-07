package com.tsw.CompayRest.Dto;

import lombok.Data;

@Data
public class NewGroupMemberDto {
    private Long id;
    private Long groupId;
    private String email;
}
