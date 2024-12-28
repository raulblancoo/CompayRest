package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    // TODO-GENERAL: queremos devolver los Dtos o los códigos HTTP correspondientes a la consulta?

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }
        return ResponseEntity.ok(users); // HTTP 200
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto user) {
        // TODO: validar si se permiten duplicados por email
        // TODO: setear correctamente la imagen de perfil
        UserDto createdUser = userService.saveUser(user);
        return ResponseEntity.status(201).body(createdUser); // HTTP 201
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto updatedUser) {
        // TODO: comprobar si cada vez que queremos actualizar un usuario queremos pasarle todos los campos o solo los que queramos cambiar
        return userService.updateUser(id, updatedUser)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // TODO: mirar si la respuesta debería ser solo los códigos (Imagino que si)
        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // HTTP 204
        } else {
            return ResponseEntity.notFound().build();  // HTTP 404
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto loginRequest, HttpSession session) {
        try{
            boolean isAuthenticated = userService.getUserByEmail(loginRequest.getEmail()).isPresent();

            if (isAuthenticated){
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
