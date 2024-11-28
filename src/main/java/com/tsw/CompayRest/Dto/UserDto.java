package com.tsw.CompayRest.Dto;

import lombok.Data;

@Data
public class UserDto {
    // TODO: se que no hace falta pero si no lo uso no sé como hacerlo
    private Long id;
    private String name;
    private String surname;
    private String username;
    private String email;
    private String password;
    private String avatarURL;
}
