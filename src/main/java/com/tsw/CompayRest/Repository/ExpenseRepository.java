package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Model.ExpenseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<ExpenseModel, Long> {
    List<ExpenseModel> findAllByGroupId(Long id);

    @Query("SELECT e FROM ExpenseModel e WHERE e.group.id = :groupId ORDER BY e.expense_date DESC")
    List<ExpenseModel> findAllByGroupIdOrderByDate(@Param("groupId") Long groupId);
}
