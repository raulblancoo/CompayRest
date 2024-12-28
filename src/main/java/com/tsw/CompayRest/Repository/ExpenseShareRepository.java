package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Model.ExpenseModel;
import com.tsw.CompayRest.Model.ExpenseShareModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseShareRepository extends JpaRepository<ExpenseShareModel, Long> {
    @Modifying
    @Query("DELETE FROM ExpenseShareModel e WHERE e.expense.id = :expenseId")
    int deleteAllByExpenseId(@Param("expenseId") Long expenseId);
}
