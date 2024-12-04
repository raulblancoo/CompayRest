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
    public List<ExpenseDto> getAllExpensesByGroupId(@PathVariable("userId") Long userId, @PathVariable("groupId") Long groupId) {
        return expenseService.getAllExpensesByGroupId(groupId);
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

            for (Map.Entry<String, Double> entry : expense.getShares().entrySet()) {
                String userEmail = entry.getKey();
                Double assignedAmount = entry.getValue();
                expenseShareService.save(savedExpense.getId(), userEmail, assignedAmount);
            }

            return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<ExpenseDto> updateExpense(@PathVariable Long id, @RequestBody ExpenseDto updatedExpense) {
//        return expenseService.updateExpense(id,updatedExpense)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable("expenseId") Long expenseId) {
        boolean deleted = expenseService.deleteExpense(expenseId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
