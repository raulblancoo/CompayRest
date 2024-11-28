package com.tsw.CompayRest.Service;

import com.tsw.CompayRest.Dto.GroupDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface GroupService {
    GroupDto saveGroup(GroupDto group);
    Optional<GroupDto> updateGroup(Long groupId, GroupDto updatedGroup);
    boolean deleteGroup(Long groupId);
    List<GroupDto> getAllGroups();
    Optional<GroupDto> getGroupById(Long groupId);
}
