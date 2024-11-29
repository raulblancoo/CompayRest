package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.NewGroupDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.GroupMemberService;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public List<GroupDto> getAllGroupsByUserId(@PathVariable("userId") Long userId) {
        return groupMemberService.getGroupsByUserId(userId);
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

    @DeleteMapping("/{groupId}")
    public void deleteGroup(@PathVariable("userId") Long userId, @PathVariable("groupId") Long groupId) {
        // TODO: mirar como hacer la lógica
    }

}
