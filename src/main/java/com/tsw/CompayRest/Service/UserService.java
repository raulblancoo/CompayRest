package com.tsw.CompayRest.Service;

import com.tsw.CompayRest.Dto.CredentialsDto;
import com.tsw.CompayRest.Dto.SignUpDto;
import com.tsw.CompayRest.Dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {

    UserDto login(CredentialsDto credentialsDto);
    UserDto register(SignUpDto userDto);
    UserDto findByEmail(String login);

    UserDto saveUser(UserDto user);
    Optional<UserDto> updateUser(Long id, UserDto updatedUser);
    boolean deleteUser(Long id);

    List<UserDto> getAllUsers();
    Optional<UserDto> getUserById(Long id);
    Optional<UserDto> getUserByEmail(String email);
}
