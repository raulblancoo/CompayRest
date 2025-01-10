package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }
        return ResponseEntity.ok(users); // HTTP 200
    }

    // Obtener el usuario autenticado
    @GetMapping("/me")
    public ResponseEntity<UserDto> getUserById(HttpServletRequest request) {
        Long id = (Long) request.getAttribute("userId");

        if (id == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // HTTP 401
        }

        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un usuario
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto user) {
        UserDto createdUser = userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser); // HTTP 201
    }

    // Actualizar el usuario autenticado
    @PutMapping
    public ResponseEntity<UserDto> updateUser(HttpServletRequest request, @RequestBody UserDto updatedUser) {
        Long id = (Long) request.getAttribute("userId");

        if (id == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // HTTP 401
        }

        return userService.updateUser(id, updatedUser)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Eliminar el usuario autenticado
    @DeleteMapping
    public ResponseEntity<Void> deleteUser(HttpServletRequest request) {
        Long id = (Long) request.getAttribute("userId");

        if (id == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // HTTP 401
        }

        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // HTTP 204
        } else {
            return ResponseEntity.notFound().build(); // HTTP 404
        }
    }

    // Login de usuario
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto loginRequest, HttpSession session) {
        try {
            boolean isAuthenticated = userService.getUserByEmail(loginRequest.getEmail()).isPresent();

            if (isAuthenticated) {
                session.setAttribute("user", loginRequest.getUsername());
                return ResponseEntity.ok("Login was successful!");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unknown error occurred");
        }
    }
}
