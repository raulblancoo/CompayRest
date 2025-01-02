package com.tsw.CompayRest.Controller;

import com.tsw.CompayRest.Dto.ExpenseDto;
import com.tsw.CompayRest.Dto.GroupDto;
import com.tsw.CompayRest.Dto.NewExpenseDto;
import com.tsw.CompayRest.Dto.UserDto;
import com.tsw.CompayRest.Service.ExpenseService;
import com.tsw.CompayRest.Service.ExpenseShareService;
import com.tsw.CompayRest.Service.GroupService;
import com.tsw.CompayRest.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users/{userId}/groups/{groupId}/expenses")
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
    public ResponseEntity<List<ExpenseDto>> getAllExpensesByGroupId(@PathVariable("userId") Long userId, @PathVariable("groupId") Long groupId) {
        List<ExpenseDto> expenses = expenseService.getAllExpensesByGroupId(groupId);

        if (expenses.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }

        return ResponseEntity.ok(expenses); // HTTP 200
    }


    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseDto> getExpenseById(@PathVariable("expenseId") Long expenseId) {
        return expenseService.getExpenseById(expenseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(@PathVariable("groupId") Long groupId, @RequestBody NewExpenseDto expense) {
        Optional<GroupDto> group = groupService.getGroupById(groupId);
        Optional<UserDto> user = userService.getUserById(expense.getOriginUserId());

        if(group.isPresent() && user.isPresent()) {
            ExpenseDto expenseDto = new ExpenseDto();
            expenseDto.setExpense_name(expense.getExpense_name());
            expenseDto.setExpense_date(LocalDate.now());
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
            expenseToUpdate.setOrigin_user(updatedExpense.getOrigin_user());
            expenseToUpdate.setGroup(updatedExpense.getGroup());

            ExpenseDto savedExpense = expenseService.saveExpense(expenseToUpdate);

            return ResponseEntity.ok(savedExpense);  // HTTP 200 OK
        }

        return ResponseEntity.notFound().build();  // HTTP 404
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
