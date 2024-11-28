package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.UserService;
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
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public UserDto createUser(@RequestBody UserDto user) {
        // TODO: comprobar si queremos que se puedan incluír varios usuarios con los mismos datos (email)
        return userService.saveUser(user);
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
}
