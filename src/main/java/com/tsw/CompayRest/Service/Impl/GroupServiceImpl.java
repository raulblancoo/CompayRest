package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Enum.Currency;
import com.tsw.CompayRest.Mapper.GroupMapper;
import com.tsw.CompayRest.Mapper.UserMapper;
import com.tsw.CompayRest.Repository.GroupRepository;
import com.tsw.CompayRest.Service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {
    private final GroupRepository groupRepository;
    private final GroupMapper groupMapper;
    private final UserMapper userMapper;

    @Override
    public GroupDto saveGroup(GroupDto group) {
        groupRepository.save(groupMapper.toEntity(group));
        return group;
    }

    @Override
    public Optional<GroupDto> updateGroup(Long groupId, GroupDto updatedGroup) {
        return groupRepository.findById(groupId).map(existingGroup -> {
            existingGroup.setGroup_name(updatedGroup.getGroup_name());
            existingGroup.setAmount(updatedGroup.getAmount());
            existingGroup.setCurrency(Currency.valueOf(updatedGroup.getCurrency()));
            existingGroup.setImgURL(updatedGroup.getImgURL());
//            existingGroup.setUsers(userMapper.toSetModel(updatedGroup.getUsers()));

            return groupMapper.toDto(groupRepository.save(existingGroup));
        });
    }

    @Override
    public boolean deleteGroup(Long groupId) {
        return groupRepository.findById(groupId).map(group -> {
            groupRepository.delete(group);
            return true;
        }).orElse(false);
    }

    @Override
    public List<GroupDto> getAllGroups() {
        return groupMapper.toListDto(groupRepository.findAll());
    }

    @Override
    public Optional<GroupDto> getGroupById(Long groupId) {
        return groupRepository.findById(groupId).map(groupMapper::toDto);
    }
}
