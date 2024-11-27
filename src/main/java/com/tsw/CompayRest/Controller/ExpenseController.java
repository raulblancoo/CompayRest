//package com.tsw.CompayRest.Controller;
//
//import com.tsw.CompayRest.Enum.ShareMethod;
//import com.tsw.CompayRest.Model.ExpenseModel;
//import com.tsw.CompayRest.Model.GroupModel;
//import com.tsw.CompayRest.Model.UserModel;
//import com.tsw.CompayRest.Repository.ExpenseRepository;
//import com.tsw.CompayRest.Repository.GroupRepository;
//import com.tsw.CompayRest.Repository.UserRepository;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Date;
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/expenses")
//public class ExpenseController {
//
//    private final ExpenseRepository expensesRepository;
//    private final UserRepository userRepository;
//    private final GroupRepository groupRepository;
//
//    public ExpenseController(ExpenseRepository expensesRepository, UserRepository userRepository, GroupRepository groupRepository) {
//        this.expensesRepository = expensesRepository;
//        this.userRepository = userRepository;
//        this.groupRepository = groupRepository;
//    }
//
//    @GetMapping
//    public List<ExpenseModel> getAllExpenses() {
//        return expensesRepository.findAll();
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ExpenseModel> getExpenseById(@PathVariable Long id) {
//        Optional<ExpenseModel> expense = expensesRepository.findById(id);
//        if (expense.isPresent()) {
//            return ResponseEntity.ok(expense.get());
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @PostMapping
//    public ResponseEntity<ExpenseModel> createExpense(
//            @RequestParam double amount,
//            @RequestParam String expenseName,
//            @RequestParam Date expenseDate,
//            @RequestParam Long originUserId,
//            @RequestParam Long groupId,
//            @RequestParam String shareMethod) {
//
//        Optional<UserModel> userOptional = userRepository.findById(originUserId);
//        Optional<GroupModel> groupOptional = groupRepository.findById(groupId);
//
//        if (userOptional.isPresent() && groupOptional.isPresent()) {
//            ExpenseModel expense = new ExpenseModel();
//            expense.setAmount(amount);
//            expense.setExpense_name(expenseName);
//            expense.setExpense_date(expenseDate);
//            expense.setOrigin_user(userOptional.get());
//            expense.setGroup(groupOptional.get());
//            expense.setShare_method(ShareMethod.valueOf(shareMethod));
//            return ResponseEntity.ok(expensesRepository.save(expense));
//        } else {
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<ExpenseModel> updateExpense(
//            @PathVariable Long id,
//            @RequestBody ExpenseModel updatedExpense) {
//
//        Optional<ExpenseModel> expenseOptional = expensesRepository.findById(id);
//        if (expenseOptional.isPresent()) {
//            ExpenseModel expense = expenseOptional.get();
//            expense.setAmount(updatedExpense.getAmount());
//            expense.setExpense_name(updatedExpense.getExpense_name());
//            expense.setExpense_date(updatedExpense.getExpense_date());
//            expense.setOrigin_user(updatedExpense.getOrigin_user());
//            expense.setGroup(updatedExpense.getGroup());
//            expense.setShare_method(updatedExpense.getShare_method());
//            return ResponseEntity.ok(expensesRepository.save(expense));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
//        if (expensesRepository.existsById(id)) {
//            expensesRepository.deleteById(id);
//            return ResponseEntity.noContent().build();
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//}