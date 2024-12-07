package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Model.ExpenseModel;
import com.tsw.CompayRest.Model.ExpenseShareModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseShareRepository extends JpaRepository<ExpenseShareModel, Long> {
    boolean deleteAllByExpenseId(Long id);
}
