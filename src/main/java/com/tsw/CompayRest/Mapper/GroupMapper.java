package com.tsw.CompayRest.Mapper;

import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Model.GroupModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel="spring")
public interface GroupMapper {
    GroupDto toDto(GroupModel group);
    GroupModel toEntity(GroupDto groupDto);
    List<GroupDto> toListDto(List<GroupModel> groups);
}
