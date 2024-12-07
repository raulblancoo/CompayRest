package com.tsw.CompayRest.Mapper;

import com.tsw.CompayRest.Dto.ExpenseDto;
import com.tsw.CompayRest.Model.ExpenseModel;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.Set;

@Mapper(componentModel="spring")
public interface ExpenseMapper {
    ExpenseDto toDto(ExpenseModel expense);
    ExpenseModel toEntity(ExpenseDto expenseDto);
    List<ExpenseDto> toListDto(List<ExpenseModel> expenses);
    Set<ExpenseDto> toSetDto(Set<ExpenseModel> expenses);
}
