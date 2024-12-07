package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Model.ExpenseModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<ExpenseModel, Long> {
    List<ExpenseModel> findAllByGroupId(Long id);
//    List<ExpenseModel> findAllByGroupIdOrderByExpense_dateAsc(Long id);
}
