package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.NewGroupDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.GroupMemberService;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users/{userId}/groups")
public class GroupControllerx {

    private final GroupService groupService;
    private final UserService userService;
    private final GroupMemberService groupMemberService;

    public GroupControllerx(GroupService groupService,UserService userService,GroupMemberService groupMemberService) {
        this.groupService = groupService;
        this.userService = userService;
        this.groupMemberService = groupMemberService;
    }

//    @GetMapping
//    public List<GroupDto> getAllGroupsByUserId(@PathVariable("userId") Long userId) {
////        return groupService.getAllGroupsB();
//    }

//    @GetMapping("/{id}")
//    public ResponseEntity<GroupDto> getGroupById(@PathVariable Long id) {
//        return groupService.getGroupById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }

    @PostMapping
    public GroupDto createGroup(@PathVariable("userId") Long userId, @RequestBody NewGroupDto group) {
        Optional<UserDto> user = userService.getUserById(userId);
        UserDto userDto = new UserDto();

        if (user.isPresent()) {
            userDto = user.get();
        }

        GroupDto savedGroup = groupService.saveGroup(group);

        groupMemberService.saveGroupMember(savedGroup,userDto);

        return savedGroup;
    }

}
