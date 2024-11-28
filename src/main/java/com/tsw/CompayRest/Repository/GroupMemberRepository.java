package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Model.GroupMemberModel;
import com.tsw.CompayRest.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMemberModel, Long> {
    Optional<GroupMemberModel> findByGroup_IdAndUser_Id(Long groupId, Long userId);
}
