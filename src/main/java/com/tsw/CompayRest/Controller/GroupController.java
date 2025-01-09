package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.NewGroupDto;
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

@RestController
@RequestMapping("/users/groups")
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
    public ResponseEntity<List<GroupDto>> getAllGroupsByUserId(HttpServletRequest request) {

        Long userId = (Long) request.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // HTTP 401
        }

        List<GroupDto> groups = groupMemberService.getGroupsByUserId(userId);
        if (groups.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }
        return ResponseEntity.ok(groups); // HTTP 200
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> getGroupById(HttpServletRequest request, @PathVariable("groupId") Long groupId) {
        Long userId = (Long) request.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // HTTP 401
        }
        GroupMemberDto member = groupMemberService.getGroupMember(groupId,userId);

        if (member != null) {
            return ResponseEntity.ok(member.getGroup());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // TODO: comprobar si es del todo correcta, es decir, si las validaciones que no se hacen hacen falta
    @PostMapping
    public ResponseEntity<GroupDto> createGroup(HttpServletRequest request, @RequestBody NewGroupDto group) {
        Long userId = (Long) request.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // HTTP 401
        }
        Optional<UserDto> user = userService.getUserById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().build(); // HTTP 400 si el usuario no existe
        }

        GroupDto savedGroup = groupService.saveGroup(group);

        // Nos guardamos siempre a nosotros como miembro
        groupMemberService.saveGroupMember(savedGroup, user.get());

        // Agregamos los demás miembros por email
        for (String email : group.getUserEmails()) {
            groupMemberService.saveGroupMember(savedGroup, email);
        }

        return ResponseEntity.status(201).body(savedGroup); // HTTP 201
    }
}
