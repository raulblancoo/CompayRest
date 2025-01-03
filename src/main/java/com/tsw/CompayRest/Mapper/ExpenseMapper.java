package com.tsw.CompayRest.Mapper;

import com.tsw.CompayRest.Dto.ExpenseDto;
import com.tsw.CompayRest.Model.ExpenseModel;
import com.tsw.CompayRest.Repository.GroupRepository;
import com.tsw.CompayRest.Repository.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {UserRepository.class, GroupRepository.class})
public interface ExpenseMapper {
    ExpenseDto toDto(ExpenseModel expense);


    ExpenseModel toEntity(ExpenseDto expenseDto);

    List<ExpenseDto> toListDto(List<ExpenseModel> expenses);
    Set<ExpenseDto> toSetDto(Set<ExpenseModel> expenses);
}
