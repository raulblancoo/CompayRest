package com.tsw.CompayRest.Dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class GroupMemberDto {
    private GroupDto group;
    private UserDto user;
    private LocalDate join_date;
}
