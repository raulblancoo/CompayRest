package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Model.GroupMemberModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMemberModel, Long> {
    Optional<GroupMemberModel> findByGroup_IdAndUser_Id(Long groupId, Long userId);
    List<GroupMemberModel> findAllByGroup_Id(Long groupId);
    List<GroupMemberModel> findAllByUser_Id(Long userId);
    boolean existsByGroupIdAndUserId(Long groupId, Long userId);
}
