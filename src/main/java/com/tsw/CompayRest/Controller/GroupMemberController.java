//package com.tsw.CompayRest.Controller;
//
//import com.tsw.CompayRest.Model.GroupMemberModel;
//import com.tsw.CompayRest.Model.GroupModel;
//import com.tsw.CompayRest.Model.UserModel;
//import com.tsw.CompayRest.Repository.GroupMemberRepository;
//import com.tsw.CompayRest.Repository.GroupRepository;
//import com.tsw.CompayRest.Repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/group-members")
//public class GroupMemberController {
//
//    private final GroupMemberRepository groupMembersRepository;
//    private final UserRepository userRepository;
//    private final GroupRepository groupRepository;
//
//    public GroupMemberController(GroupMemberRepository groupMembersRepository, UserRepository userRepository, GroupRepository groupRepository) {
//        this.groupMembersRepository = groupMembersRepository;
//        this.userRepository = userRepository;
//        this.groupRepository = groupRepository;
//    }
//
//    @GetMapping
//    public List<GroupMemberModel> getAllGroupMembers() {
//        return groupMembersRepository.findAll();
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<GroupMemberModel> getGroupMemberById(@PathVariable Long id) {
//        Optional<GroupMemberModel> member = groupMembersRepository.findById(id);
//        if (member.isPresent()) {
//            return ResponseEntity.ok(member.get());
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @PostMapping
//    public ResponseEntity<GroupMemberModel> addUserToGroup(@RequestParam Long userId, @RequestParam Long groupId) {
//        Optional<GroupModel> group = groupRepository.findById(groupId);
//        Optional<UserModel> user = userRepository.findById(userId);
//
//        if (user.isPresent() && group.isPresent()) {
//            GroupMemberModel newMember = new GroupMemberModel();
//            newMember.setUser(user.get());
//            newMember.setGroup(group.get());
//            return ResponseEntity.ok(groupMembersRepository.save(newMember));
//        } else {
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> removeUserFromGroup(@PathVariable Long id) {
//        if (groupMembersRepository.existsById(id)) {
//            groupMembersRepository.deleteById(id);
//            return ResponseEntity.noContent().build();
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//}