package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.NewGroupDto;
import com.tsw.CompayRest.Enum.Currency;
import com.tsw.CompayRest.Mapper.GroupMapper;
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

    @Override
    public GroupDto saveGroup(NewGroupDto newGroup) {
        // TODO: solo haría falta el NewGroup si al crear un grupo tuviera que tener ciertos emails asociados
        List<String> emailsList = newGroup.getUserEmails();

        GroupDto group = new GroupDto();
        group.setGroup_name(newGroup.getGroup_name());
        group.setAmount(newGroup.getAmount());
        group.setImgURL(newGroup.getImgURL());
        group.setCurrency(newGroup.getCurrency());

        return groupMapper.toDto(groupRepository.save(groupMapper.toEntity(group)));
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
