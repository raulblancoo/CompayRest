package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.GroupMemberService;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users/{userId}/groups/{groupId}/members")
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
    public ResponseEntity<List<UserDto>> getGroupMembers(@PathVariable Long userId, @PathVariable("groupId") Long groupId) {
        List<UserDto> members = groupMemberService.getAllGroupMembers(groupId);

        if (members.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }

        return ResponseEntity.ok(members); // HTTP 200
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<UserDto> getSpecificMember(@PathVariable Long groupId, @PathVariable Long memberId, @PathVariable Long userId) {
        GroupMemberDto member = groupMemberService.getGroupMember(groupId, memberId);

        if (member == null) {
            return ResponseEntity.notFound().build(); //HTTP 404
        }

        return ResponseEntity.ok(member.getUser()); // HTTP 200
    }

    // TODO: response de GroupMemberDto o UserDto?
    @PostMapping
    public ResponseEntity<GroupMemberDto> addGroupMember(@PathVariable("groupId") Long groupId, @RequestBody UserDto user, @PathVariable Long userId) {

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

    // TODO: para el create realmente no hace falta introducir más que la lista de emails (mirar chatgpt raúl para cambiarlo)
    @PostMapping("/email")
    public ResponseEntity<Void> addGroupMemberByEmail(@PathVariable("groupId") Long groupId, @RequestBody List<String> emails ) {
        Optional<GroupDto> group = groupService.getGroupById(groupId);


        for(String email: emails) {
            Optional<UserDto> user = userService.getUserByEmail(email);

            if (group.isPresent() && user.isPresent() ) {
                groupMemberService.saveGroupMember(group.get(), user.get());
            }
        }

        return ResponseEntity.noContent().build();
    }

    // TODO: no funciona correctamente el borrar miembro (NO LO BORRA, service o repository)
    @DeleteMapping("/{memberId}")
    public ResponseEntity<HttpStatus> deleteGroupMember(@PathVariable Long groupId, @PathVariable Long memberId, @PathVariable Long userId) {
        GroupMemberDto membership = groupMemberService.getGroupMember(groupId, memberId);

        if (membership == null) {
            return ResponseEntity.notFound().build(); //HTTP 404
        }

        boolean deleted = groupMemberService.deleteGroupMember(groupId, membership.getUser());

        if (deleted) {
            return ResponseEntity.noContent().build(); // HTTP 204
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP 500
        }
    }

}
