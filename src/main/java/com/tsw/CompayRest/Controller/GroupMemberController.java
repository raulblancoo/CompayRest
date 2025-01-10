package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.GroupMemberService;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users/groups/{groupId}/members")
public class GroupMemberController {
    private final GroupMemberService groupMemberService;
    private final UserService userService;
    private final GroupService groupService;

    public GroupMemberController(GroupMemberService groupMemberService, UserService userService, GroupService groupService) {
        this.groupMemberService = groupMemberService;
        this.userService = userService;
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getGroupMembers( @PathVariable("groupId") Long groupId) {
        List<UserDto> members = groupMemberService.getAllGroupMembers(groupId);

        if (members.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }

        return ResponseEntity.ok(members); // HTTP 200
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<UserDto> getSpecificMember(@PathVariable Long groupId, @PathVariable Long memberId) {
        GroupMemberDto member = groupMemberService.getGroupMember(groupId, memberId);

        if (member == null) {
            return ResponseEntity.notFound().build(); //HTTP 404
        }

        return ResponseEntity.ok(member.getUser()); // HTTP 200
    }

    // TODO: response de GroupMemberDto o UserDto?
    @PostMapping
    public ResponseEntity<GroupMemberDto> addGroupMember(@PathVariable("groupId") Long groupId, @RequestBody UserDto user) {

        if (user.getId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        Optional<UserDto> newUser = userService.getUserById(user.getId());
        Optional<GroupDto> group = groupService.getGroupById(groupId);

        if (newUser.isPresent() && group.isPresent()) {
            GroupMemberDto savedMember = groupMemberService.saveGroupMember(group.get(), newUser.get());
            return ResponseEntity.ok(savedMember);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @PostMapping("/email")
    public ResponseEntity<String> addGroupMemberByEmail(@PathVariable("groupId") Long groupId,
            @RequestBody List<String> emails) {

        // Verificar si el grupo existe
        Optional<GroupDto> groupOpt = groupService.getGroupById(groupId);
        if (groupOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("El grupo con ID " + groupId + " no existe.");
        }

        GroupDto group = groupOpt.get();

        // Obtener todos los miembros actuales del grupo
        List<UserDto> existingMembers = groupMemberService.getAllGroupMembers(groupId);

        // Validar que todos los correos electrónicos existan en la base de datos
        List<String> nonExistentEmails = emails.stream()
                .filter(email -> !userService.existsByEmail(email))
                .collect(Collectors.toList());

        if (!nonExistentEmails.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    "Los siguientes correos electrónicos no existen en la base de datos: " + nonExistentEmails);
        }

        // Identificar los correos electrónicos que ya están en el grupo
        List<String> alreadyInGroupEmails = emails.stream()
                .filter(existingMembers::contains)
                .collect(Collectors.toList());

        if (!alreadyInGroupEmails.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    "Los siguientes correos electrónicos ya están en el grupo: " + alreadyInGroupEmails);
        }

        // Si todas las validaciones pasan, agregar los miembros al grupo
        for (String email : emails) {
            Optional<UserDto> userOpt = userService.getUserByEmail(email);
            if (userOpt.isPresent()) {
                groupMemberService.saveGroupMember(group, userOpt.get());
            }
        }

        return ResponseEntity.noContent().build(); // HTTP 204
    }
}
