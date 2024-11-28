package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Model.GroupModel;
import com.tsw.CompayRest.Repository.GroupRepository;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/groups")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public List<GroupDto> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDto> getGroupById(@PathVariable Long id) {
        return groupService.getGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GroupDto createGroup(@RequestBody GroupDto group) {
        return groupService.saveGroup(group);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupDto> updateGroup(@PathVariable Long id, @RequestBody GroupDto updatedGroup) {
//        Optional<GroupModel> groupOptional = groupRepository.findById(id);
//        if (groupOptional.isPresent()) {
//            GroupModel group = groupOptional.get();
//            group.setGroup_name(updatedGroup.getGroup_name());
//            group.setImgURL(updatedGroup.getImgURL());
//            group.setAmount(updatedGroup.getAmount());
//            group.setCurrency(updatedGroup.getCurrency());
//            return ResponseEntity.ok(groupRepository.save(group));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
        return ResponseEntity.of(groupService.updateGroup(id, updatedGroup));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        boolean deleted = groupService.deleteGroup(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}