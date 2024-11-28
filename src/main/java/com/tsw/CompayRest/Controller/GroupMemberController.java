package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.GroupMemberService;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
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
    public List<GroupMemberDto> getGroupMembers(@PathVariable("groupId") Long groupId) {
        return groupMemberService.getAllGroupMembers(groupId);
    }

    // TODO: comprobar por qué esto no funciona
//    @GetMapping("/{memberId}")
//    public ResponseEntity<GroupMemberDto> getSpecificMember(@PathVariable Long groupId, @PathVariable Long memberId) {
//        return groupMemberService.getGroupMember(groupId,memberId)
//                .map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }

    @PostMapping
    public GroupMemberDto addGroupMember(@PathVariable Long groupId, UserDto user) {
        Optional<UserDto> newUser = userService.getUserById(user.getId());
        Optional<GroupDto> group = groupService.getGroupById(groupId);

        if(newUser.isPresent() && group.isPresent()) {
            return groupMemberService.saveGroupMember(group.get(), newUser.get());
        }

        // TODO: Mirar qué respuesta habría que dar en caso de que no sea posible
        return null;
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
