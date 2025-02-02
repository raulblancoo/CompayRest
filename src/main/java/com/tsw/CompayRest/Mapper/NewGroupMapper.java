package com.tsw.CompayRest.Mapper;

import com.tsw.CompayRest.Dto.NewGroupDto;
import com.tsw.CompayRest.Model.GroupModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel="spring")
public interface NewGroupMapper {
    NewGroupDto toDto(GroupModel group);
    GroupModel toEntity(NewGroupDto newGroupDto);
    List<NewGroupDto> toListDto(List<GroupModel> groups);
}
