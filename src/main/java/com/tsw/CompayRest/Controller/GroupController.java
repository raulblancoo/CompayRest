package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Model.GroupModel;
import com.tsw.CompayRest.Repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupRepository groupRepository;

    public GroupController(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @GetMapping
    public List<GroupModel> getAllGroups() {
        return groupRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupModel> getGroupById(@PathVariable Long id) {
        Optional<GroupModel> group = groupRepository.findById(id);
        return group.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public GroupModel createGroup(@RequestBody GroupModel group) {
        return groupRepository.save(group);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupModel> updateGroup(@PathVariable Long id, @RequestBody GroupModel updatedGroup) {
        Optional<GroupModel> groupOptional = groupRepository.findById(id);
        if (groupOptional.isPresent()) {
            GroupModel group = groupOptional.get();
            group.setGroup_name(updatedGroup.getGroup_name());
            group.setImgURL(updatedGroup.getImgURL());
            group.setAmount(updatedGroup.getAmount());
            group.setCurrency(updatedGroup.getCurrency());
            return ResponseEntity.ok(groupRepository.save(group));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        if (groupRepository.existsById(id)) {
            groupRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}