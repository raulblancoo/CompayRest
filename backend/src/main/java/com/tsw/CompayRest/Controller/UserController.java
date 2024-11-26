package com.tsw.CompayRest.Controller;


import com.tsw.CompayRest.Model.UserModel;
import com.tsw.CompayRest.Repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public UserModel createUser(@RequestBody UserModel user) {
        return userRepository.save(user);
    }
}
