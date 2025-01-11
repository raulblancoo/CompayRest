package com.tsw.CompayRest.Dto;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
public class UserAuthDto implements UserDetails {
    private Long id;
    private String name;
    private String surname;
    private String username;
    private String password;
    private List<GroupDto> group;
    private String email;
    private String avatarURL;

    public UserAuthDto(UserDto user, List<GroupDto> group) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.group = group;
        this.email = user.getEmail();
        this.avatarURL = user.getAvatarURL();
    }

    public UserAuthDto(String email) {
        this.username = username;
        this.password = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

// TODO: Eliminar???