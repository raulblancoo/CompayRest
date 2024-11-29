package com.tsw.CompayRest.Service;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface GroupMemberService {
    GroupMemberDto saveGroupMember(GroupDto groupDto, UserDto userDto);
    boolean deleteGroupMember(Long groupId, UserDto userDto);
    GroupMemberDto getGroupMember(Long groupId, Long memberId);
    List<GroupMemberDto> getAllGroupMembers(Long groupId);
    List<GroupDto> getGroupsByUserId(Long userId);
}
