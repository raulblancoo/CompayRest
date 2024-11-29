package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Mapper.GroupMapper;
import com.tsw.CompayRest.Mapper.GroupMemberMapper;
import com.tsw.CompayRest.Repository.GroupMemberRepository;
import com.tsw.CompayRest.Service.GroupMemberService;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupMemberServiceImpl implements GroupMemberService {
    private final GroupMemberRepository groupMemberRepository;
    private final GroupMemberMapper groupMemberMapper;
    private final UserService userService;
    private final GroupService groupService;
    private final GroupMapper groupMapper;

    @Override
    public GroupMemberDto saveGroupMember(GroupDto groupDto, UserDto userDto) {
        GroupMemberDto groupMemberDto = new GroupMemberDto();
        groupMemberDto.setUser(userDto);
        groupMemberDto.setGroup(groupDto);

        return groupMemberMapper.toDto(groupMemberRepository.save(groupMemberMapper.toEntity(groupMemberDto)));
    }

    @Override
    public boolean deleteGroupMember(Long groupId, UserDto userDto) {
        return groupMemberRepository.findById(groupId).map(member -> {
            groupMemberRepository.delete(member);
            return true;
        }).orElse(false);
    }

    @Override
    public GroupMemberDto getGroupMember(Long groupId, Long memberId) {
        // TODO: mirar si hay mejor manera de hacerlo
        return groupMemberRepository.findByGroup_IdAndUser_Id(groupId, memberId).map(groupMemberMapper::toDto).orElse(null);
    }

    @Override
    public List<GroupMemberDto> getAllGroupMembers(Long groupId) {
        return groupMemberMapper.toListDto(groupMemberRepository.findAllByGroup_Id(groupId));
    }

    @Override
    public List<GroupDto> getGroupsByUserId(Long userId) {
        List<GroupDto> groups = new ArrayList<>();
        List<GroupMemberDto> memberships = groupMemberMapper.toListDto(groupMemberRepository.findAllByUser_Id(userId));

        for (GroupMemberDto membership : memberships) {
            GroupDto groupDto = membership.getGroup();
            groups.add(groupDto);
        }

        return groups;
    }
}
