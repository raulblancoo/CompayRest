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

import java.util.ArrayList;
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
    public List<UserDto> getGroupMembers(@PathVariable("groupId") Long groupId) {
        List<GroupMemberDto>  members = groupMemberService.getAllGroupMembers(groupId);
        List<UserDto> users = new ArrayList<>();

        for(GroupMemberDto member : members) {
            users.add(member.getUser());
        }

        return users;
    }

    // TODO: comprobar por qué esto no funciona
//    @GetMapping("/{memberId}")
//    public ResponseEntity<GroupMemberDto> getSpecificMember(@PathVariable Long groupId, @PathVariable Long memberId) {
//        return groupMemberService.getGroupMember(groupId,memberId)
//                .map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }

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

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> deleteGroupMember(@PathVariable Long groupId, UserDto user) {
        boolean deleted = groupMemberService.deleteGroupMember(groupId, user);
        if(deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
