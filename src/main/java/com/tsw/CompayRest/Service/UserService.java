package com.tsw.CompayRest.Service;

import com.tsw.CompayRest.Dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {
    UserDto saveUser(UserDto user);
    Optional<UserDto> updateUser(Long id, UserDto updatedUser);
    boolean deleteUser(Long id);
    List<UserDto> getAllUsers();
    Optional<UserDto> getUserById(Long id);
}
