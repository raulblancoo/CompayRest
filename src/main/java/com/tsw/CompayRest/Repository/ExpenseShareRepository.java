package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Dto.ExpenseShareDto;
import com.tsw.CompayRest.Model.ExpenseShareModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ExpenseShareRepository extends JpaRepository<ExpenseShareModel, Long> {

  
    //boolean deleteAllByExpenseId(Long id);
    List<ExpenseShareModel> findAllByExpenseId(Long id);
  
    @Modifying
    @Query("DELETE FROM ExpenseShareModel e WHERE e.expense.id = :expenseId")
    int deleteAllByExpenseId(@Param("expenseId") Long expenseId);

  
}
