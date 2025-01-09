package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.NewGroupDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.GroupMemberService;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users/{userId}/groups")
public class GroupController {

    private final GroupService groupService;
    private final UserService userService;
    private final GroupMemberService groupMemberService;

    public GroupController(GroupService groupService, UserService userService, GroupMemberService groupMemberService) {
        this.groupService = groupService;
        this.userService = userService;
        this.groupMemberService = groupMemberService;
    }

    @GetMapping
    public ResponseEntity<List<GroupDto>> getAllGroupsByUserId(@PathVariable("userId") Long userId) {
        List<GroupDto> groups = groupMemberService.getGroupsByUserId(userId);
        if (groups.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }
        return ResponseEntity.ok(groups); // HTTP 200
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> getGroupById(@PathVariable("userId") Long userId, @PathVariable("groupId") Long groupId) {
        GroupMemberDto member = groupMemberService.getGroupMember(groupId,userId);

        if (member != null) {
            return ResponseEntity.ok(member.getGroup());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createGroup(@PathVariable("userId") Long userId, @RequestBody NewGroupDto group) {
        // Obtener el usuario que está creando el grupo
        Optional<UserDto> user = userService.getUserById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("El usuario con ID " + userId + " no existe."); // HTTP 400 si el usuario no existe
        }

        List<String> userEmails = group.getUserEmails();

        // Validar que todos los correos electrónicos existan en la base de datos
        List<String> nonExistentEmails = userEmails.stream()
                .filter(email -> !userService.existsByEmail(email))
                .collect(Collectors.toList());

        if (!nonExistentEmails.isEmpty()) {
            String errorMessage = "Los siguientes correos electrónicos no existen: " + nonExistentEmails;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage); // HTTP 404 si algún correo no existe
        }

        GroupDto savedGroup = groupService.saveGroup(group);

        groupMemberService.saveGroupMember(savedGroup, user.get());

        for (String email : userEmails) {
            groupMemberService.saveGroupMember(savedGroup, email);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedGroup); // HTTP 201
    }


}
