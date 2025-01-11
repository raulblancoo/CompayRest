package com.tsw.CompayRest.Mapper;

import com.tsw.CompayRest.Dto.GroupMemberDto;
import com.tsw.CompayRest.Model.GroupMemberModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel="spring")
public interface GroupMemberMapper {
    GroupMemberDto toDto(GroupMemberModel member);
    GroupMemberModel toEntity(GroupMemberDto member);
    List<GroupMemberDto> toListDto(List<GroupMemberModel> members);
}
