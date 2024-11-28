package com.tsw.CompayRest.Dto;

import lombok.Data;

@Data
public class GroupMemberDto {
    private GroupDto group;
    private UserDto user;
}
