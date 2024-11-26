package com.tsw.CompayRest.Controller;


import com.tsw.CompayRest.Model.UserModel;
import com.tsw.CompayRest.Repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
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

    @PutMapping
    public UserModel updateUser(@RequestBody UserModel user) {
        return userRepository.save(user);
    }

    @DeleteMapping
    public void deleteUser(@RequestBody UserModel user) {
        userRepository.delete(user);
    }
}
