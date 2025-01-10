package com.tsw.CompayRest.Service;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GroupMemberService {
    GroupMemberDto saveGroupMember(GroupDto groupDto, UserDto userDto);
    void saveGroupMember(GroupDto groupDto, String email);
    boolean deleteGroupMember(Long groupId, UserDto userDto);
    GroupMemberDto getGroupMember(Long groupId, Long memberId);
    List<UserDto> getAllGroupMembers(Long groupId);
    List<GroupDto> getGroupsByUserId(Long userId);
    boolean isGroupMember(Long groupId, Long memberId);
}
