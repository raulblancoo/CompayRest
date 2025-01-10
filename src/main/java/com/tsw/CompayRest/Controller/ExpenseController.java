package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.*;
import com.tsw.CompayRest.Service.ExpenseService;
import com.tsw.CompayRest.Service.ExpenseShareService;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/users/groups/{groupId}/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;
    private final GroupService groupService;
    private final UserService userService;
    private final ExpenseShareService expenseShareService;

    public ExpenseController(ExpenseService expenseService, GroupService groupService, UserService userService, ExpenseShareService expenseShareService) {
        this.expenseService = expenseService;
        this.groupService = groupService;
        this.userService = userService;
        this.expenseShareService = expenseShareService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> getAllExpensesByGroupId(@PathVariable("groupId") Long groupId) {

        List<ExpenseDto> expenses = expenseService.getAllExpensesByGroupId(groupId);

        if (expenses.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }

        return ResponseEntity.ok(expenses); // HTTP 200
    }


    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseDto> getExpenseById(@PathVariable("expenseId") Long expenseId) {
        Optional<ExpenseDto> expense = expenseService.getExpenseById(expenseId);

        if (expense.isPresent()) {
            ExpenseDto expenseDto = expense.get(); // Extraer el objeto del Optional

            expenseDto.setShares(expenseShareService.getExpenseShareByExpenseId(expenseId));

            return ResponseEntity.ok(expenseDto);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(@PathVariable("groupId") Long groupId, @RequestBody NewExpenseDto expense) {
        Optional<GroupDto> group = groupService.getGroupById(groupId);
        Optional<UserDto> user = userService.getUserById(expense.getOriginUserId());

        if(group.isPresent() && user.isPresent()) {
            ExpenseDto expenseDto = new ExpenseDto();
            expenseDto.setExpense_name(expense.getExpense_name());
            expenseDto.setExpense_date(LocalDateTime.now());
            expenseDto.setAmount(expense.getAmount());
            expenseDto.setShare_method(expense.getShare_method());
            expenseDto.setOrigin_user(user.get());
            expenseDto.setGroup(group.get());

            ExpenseDto savedExpense = expenseService.saveExpense(expenseDto);

            groupService.updateGroupAmount(groupId, savedExpense.getAmount());

            for (Map.Entry<String, Double> entry : expense.getShares().entrySet()) {
                String userEmail = entry.getKey();
                Double assignedAmount = entry.getValue();
                expenseShareService.save(savedExpense.getId(), userEmail, assignedAmount);
            }

            return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseDto> updateExpense(@PathVariable("expenseId") Long expenseId, @RequestBody ExpenseDto updatedExpense) {
        Optional<ExpenseDto> existingExpense = expenseService.getExpenseById(expenseId);

        if (existingExpense.isPresent()) {
            ExpenseDto expenseToUpdate = existingExpense.get();

            expenseToUpdate.setExpense_name(updatedExpense.getExpense_name());
            expenseToUpdate.setAmount(updatedExpense.getAmount());
            expenseToUpdate.setExpense_date(updatedExpense.getExpense_date());
            expenseToUpdate.setShare_method(updatedExpense.getShare_method());
            expenseToUpdate.setOrigin_user(userService.getUserById(updatedExpense.getOrigin_user().getId()).orElseThrow());
            expenseToUpdate.setGroup(groupService.getGroupById(updatedExpense.getGroup().getId()).orElseThrow());

            ExpenseDto savedExpense = expenseService.saveExpense(expenseToUpdate);

            expenseShareService.deleteAll(expenseId);

            for (ExpenseShareDto expense : updatedExpense.getShares()) {
                expenseShareService.save(savedExpense.getId(), String.valueOf(expense.getDestiny_user().getEmail()), expense.getAssignedAmount());
            }

            return ResponseEntity.ok(savedExpense);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable("groupId") Long groupId, @PathVariable("expenseId") Long expenseId) {
        Optional<ExpenseDto> toDelete = expenseService.getExpenseById(expenseId);

        if(toDelete.isPresent()) {
            boolean deletedShare = expenseShareService.deleteAll(expenseId);
            boolean deletedExp = expenseService.deleteExpense(expenseId);

            if(deletedShare && deletedExp) {
                groupService.updateGroupAmount(groupId,-toDelete.get().getAmount());
                return ResponseEntity.noContent().build();
            }

        }

        return ResponseEntity.notFound().build();
    }
}
