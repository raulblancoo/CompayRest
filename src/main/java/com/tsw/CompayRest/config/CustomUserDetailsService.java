package com.tsw.CompayRest.config;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.UserAuthDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Mapper.UserMapper;
import com.tsw.CompayRest.Repository.UserRepository;
import com.tsw.CompayRest.Repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        //UserDto user = userMapper.toDto(userRepository.findUserModelByEmail(email));

        UserAuthDto userAuth = new UserAuthDto(email);

        if(userAuth != null) {
            return userAuth;
        } else {
            throw new UsernameNotFoundException("Invalid username or password");
        }
    }
}