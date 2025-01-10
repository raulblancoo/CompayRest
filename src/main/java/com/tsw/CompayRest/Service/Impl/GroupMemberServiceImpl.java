package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Mapper.GroupMemberMapper;
import com.tsw.CompayRest.Repository.GroupMemberRepository;
import com.tsw.CompayRest.Service.GroupMemberService;
import com.tsw.CompayRest.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupMemberServiceImpl implements GroupMemberService {
    private final GroupMemberRepository groupMemberRepository;
    private final GroupMemberMapper groupMemberMapper;
    private final UserService userService;

    @Override
    public GroupMemberDto saveGroupMember(GroupDto groupDto, UserDto userDto) {
        GroupMemberDto groupMemberDto = new GroupMemberDto();
        groupMemberDto.setUser(userDto);
        groupMemberDto.setGroup(groupDto);
        groupMemberDto.setJoin_date(LocalDate.now());

        return groupMemberMapper.toDto(groupMemberRepository.save(groupMemberMapper.toEntity(groupMemberDto)));
    }

    @Override
    public void saveGroupMember(GroupDto groupDto, String email) {
        GroupMemberDto groupMemberDto = new GroupMemberDto();
        Optional<UserDto> user = userService.getUserByEmail(email);

        if(user.isPresent()) {
            groupMemberDto.setUser(user.get());
            groupMemberDto.setGroup(groupDto);
            groupMemberDto.setJoin_date(LocalDate.now());
        }

        groupMemberMapper.toDto(groupMemberRepository.save(groupMemberMapper.toEntity(groupMemberDto)));
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
    public List<UserDto> getAllGroupMembers(Long groupId) {
        List<GroupMemberDto> members = groupMemberMapper.toListDto(groupMemberRepository.findAllByGroup_Id(groupId));
        List<UserDto> users = new ArrayList<>();

        for(GroupMemberDto member : members) {
            users.add(member.getUser());
        }

        return users;
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

    @Override
    public boolean isGroupMember(Long groupId, Long memberId) {
        return groupMemberRepository.existsByGroupIdAndUserId(groupId, memberId);
    }
}
