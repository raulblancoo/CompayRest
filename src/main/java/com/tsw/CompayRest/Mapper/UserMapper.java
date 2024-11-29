package com.tsw.CompayRest.Mapper;

import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Model.UserModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel="spring")
public interface UserMapper {
    UserDto toDto(UserModel userModel);
    UserModel toEntity(UserDto userDto);
    List<UserDto> toListDto(List<UserModel> users);
    Set<UserDto> toSetDto(Set<UserModel> users);
    Set<UserModel> toSetModel(Set<UserDto> user);

    @Mapping(source="password", target="password")
    UserModel toNewEntity(UserDto userDto, String password);
}