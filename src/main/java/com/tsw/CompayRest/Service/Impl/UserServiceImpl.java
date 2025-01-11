package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.CredentialsDto;
import com.tsw.CompayRest.Dto.SignUpDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Exceptions.AppException;
import com.tsw.CompayRest.Mapper.UserMapper;
import com.tsw.CompayRest.Model.UserModel;
import com.tsw.CompayRest.Repository.UserRepository;
import com.tsw.CompayRest.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDto login(CredentialsDto credentialsDto) {
        UserModel user = userRepository.findByEmail(credentialsDto.email())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(SignUpDto userDto) {
        Optional<UserModel> emailUser = userRepository.findByEmail(userDto.email());
        Optional<UserModel> usernameUser = userRepository.findByUsername(userDto.username());

        if (emailUser.isPresent()) {
            throw new AppException("Email already exists", HttpStatus.BAD_REQUEST);
        }
        if (usernameUser.isPresent()) {
            throw new AppException("Username already exists", HttpStatus.BAD_REQUEST);
        }

        UserModel user = userMapper.signUpToUser(userDto);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.password())));

        user.setAvatarURL("https://api.dicebear.com/9.x/lorelei/svg?seed=" + user.getName() + user.getSurname());
        UserModel savedUser = userRepository.save(user);

        return userMapper.toDto(savedUser);
    }

    public UserDto findByEmail(String login) {
        UserModel user = userRepository.findByEmail(login)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toDto(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean allEmailsExist(List<String> emails) {
        long count = userRepository.countByEmailIn(emails);
        return count == emails.size();
    }


    @Override
    public UserDto saveUser(UserDto userDto){
        userRepository.save(userMapper.toNewEntity(userDto, passwordEncoder.encode(userDto.getPassword())));
        return userDto;
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

    @Override
    public Optional<UserDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(userMapper::toDto);
    }


}
