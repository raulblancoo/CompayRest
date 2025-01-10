package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.*;
import com.tsw.CompayRest.Service.*;
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
    private final GroupMemberService groupMemberService;

    public ExpenseController(ExpenseService expenseService, GroupService groupService, UserService userService, ExpenseShareService expenseShareService, GroupMemberService groupMemberService) {
        this.expenseService = expenseService;
        this.groupService = groupService;
        this.userService = userService;
        this.expenseShareService = expenseShareService;
        this.groupMemberService = groupMemberService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> getAllExpensesByGroupId(HttpServletRequest request, @PathVariable("groupId") Long groupId) {
        Long userId = (Long) request.getAttribute("userId");

        if(groupMemberService.isGroupMember(groupId, userId)) {
            List<ExpenseDto> expenses = expenseService.getAllExpensesByGroupId(groupId);

            if (expenses.isEmpty()) {
                return ResponseEntity.noContent().build(); // HTTP 204
            }

            return ResponseEntity.ok(expenses); // HTTP 200
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }


    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseDto> getExpenseById(HttpServletRequest request,@PathVariable("groupId") Long groupId, @PathVariable("expenseId") Long expenseId) {
        Long userId = (Long) request.getAttribute("userId");

        if(groupMemberService.isGroupMember(groupId, userId)) {
            Optional<ExpenseDto> expense = expenseService.getExpenseById(expenseId);

            if (expense.isPresent()) {
                ExpenseDto expenseDto = expense.get(); // Extraer el objeto del Optional

                expenseDto.setShares(expenseShareService.getExpenseShareByExpenseId(expenseId));

                return ResponseEntity.ok(expenseDto);
            }

            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(HttpServletRequest request, @PathVariable("groupId") Long groupId, @RequestBody NewExpenseDto expense) {
        Long userId = (Long) request.getAttribute("userId");

        if(groupMemberService.isGroupMember(groupId, userId)) {
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
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseDto> updateExpense(HttpServletRequest request, @PathVariable("groupId") Long groupId, @PathVariable("expenseId") Long expenseId, @RequestBody ExpenseDto updatedExpense) {
        Long userId = (Long) request.getAttribute("userId");

        if(groupMemberService.isGroupMember(groupId, userId)) {
            Optional<ExpenseDto> existingExpense = expenseService.getExpenseById(expenseId);

            if (existingExpense.isPresent()) {
                double previousAmount = existingExpense.get().getAmount();
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

                groupService.editGroupAmount(groupId, previousAmount , expenseToUpdate.getAmount());

                return ResponseEntity.ok(savedExpense);
            }

            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(HttpServletRequest request, @PathVariable("groupId") Long groupId, @PathVariable("expenseId") Long expenseId) {
        Long userId = (Long) request.getAttribute("userId");

        if(groupMemberService.isGroupMember(groupId, userId)) {
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
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
