package com.tsw.CompayRest.Mapper;

import com.tsw.CompayRest.Dto.ExpenseShareDto;
import com.tsw.CompayRest.Model.ExpenseShareModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel="spring")
public interface ExpenseShareMapper {
    ExpenseShareDto toDto(ExpenseShareModel expenseShare);
    ExpenseShareModel toEntity(ExpenseShareDto expenseShare);
    List<ExpenseShareDto> toListDto(List<ExpenseShareModel> expenses);
}
