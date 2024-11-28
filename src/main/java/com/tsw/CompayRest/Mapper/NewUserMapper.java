package com.tsw.CompayRest.Mapper;

import com.tsw.CompayRest.Dto.NewUserDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Model.UserModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel="spring")
public interface NewUserMapper {
    NewUserDto toDto(UserModel userModel);
    UserModel toEntity(NewUserDto userDto);
    List<NewUserDto> toListDto(List<UserModel> users);
    Set<NewUserDto> toSetDto(Set<UserModel> users);
    Set<UserModel> toSetModel(Set<NewUserDto> user);

    @Mapping(source="password", target="password")
    UserModel toNewEntity(NewUserDto user, String password);
}
