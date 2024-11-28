package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.NewUserDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Mapper.NewUserMapper;
import com.tsw.CompayRest.Mapper.UserMapper;
import com.tsw.CompayRest.Repository.UserRepository;
import com.tsw.CompayRest.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final NewUserMapper newUserMapper;

    @Override
    public UserDto saveUser(NewUserDto newUser){
        UserDto user = userMapper.toDto(userRepository.save(newUserMapper.toNewEntity(newUser, newUser.getPassword())));
        user.setGroups(Set.of());
        return user;
    }

    @Override
    public Optional<UserDto> updateUser(Long id, UserDto updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setName(updatedUser.getName());
            existingUser.setSurname(updatedUser.getSurname());
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPassword(updatedUser.getPassword());
            existingUser.setAvatarURL(updatedUser.getAvatarURL());

            return userMapper.toDto(userRepository.save(existingUser));
        });
    }

    @Override
    public boolean deleteUser(Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userMapper.toListDto(userRepository.findAll());
    }

    @Override
    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id).map(userMapper::toDto);
    }


}
