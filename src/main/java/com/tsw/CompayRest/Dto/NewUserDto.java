package com.tsw.CompayRest.Dto;

import lombok.Data;

@Data
public class NewUserDto {
    private String name;
    private String surname;
    private String username;
    private String email;
    private String password;
    private String avatarURL;
}
