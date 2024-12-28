package com.tsw.CompayRest.Service.Impl;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.NewGroupDto;
import com.tsw.CompayRest.Enum.Currency;
import com.tsw.CompayRest.Mapper.GroupMapper;
import com.tsw.CompayRest.Repository.GroupRepository;
import com.tsw.CompayRest.Service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;


@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {
    private final GroupRepository groupRepository;
    private final GroupMapper groupMapper;

    private static final List<String> IMG_URLS = Arrays.asList(
            "/images/bg1.jpg", "/images/bg2.jpg", "/images/bg3.jpg", "/images/bg4.jpg",
            "/images/bg5.jpg", "/images/bg6.jpg", "/images/bg7.jpg", "/images/bg8.jpg",
            "/images/bg9.jpg", "/images/bg10.jpg"
    );

    @Override
    public GroupDto saveGroup(NewGroupDto newGroup) {
        GroupDto group = new GroupDto();
        group.setGroup_name(newGroup.getGroup_name());
        group.setCurrency(newGroup.getCurrency());
        group.setAmount(0);
        group.setImgURL(getImageUrl());

        return groupMapper.toDto(groupRepository.save(groupMapper.toEntity(group)));
    }

    @Override
    public Optional<GroupDto> updateGroup(Long groupId, GroupDto updatedGroup) {
        return groupRepository.findById(groupId).map(existingGroup -> {
            existingGroup.setGroup_name(updatedGroup.getGroup_name());
            existingGroup.setAmount(updatedGroup.getAmount());
            existingGroup.setCurrency(Currency.valueOf(updatedGroup.getCurrency()));
            existingGroup.setImgURL(updatedGroup.getImgURL());

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

    @Override
    public void updateGroupAmount(Long groupId, double amount) {
        groupRepository.findById(groupId).ifPresent(existingGroup -> {
            existingGroup.setAmount(existingGroup.getAmount() + amount);
            groupRepository.save(existingGroup);
        });
    }


    private String getImageUrl() {
        return IMG_URLS.get(getRandomNumber(IMG_URLS.size()));
    }

    private int getRandomNumber(int size) {
        Random random = new Random();
        return random.nextInt(size);
    }
}
