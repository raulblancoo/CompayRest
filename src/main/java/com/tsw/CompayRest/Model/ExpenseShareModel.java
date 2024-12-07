package com.tsw.CompayRest.Model;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "expenses_share")
public class ExpenseShareModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private ExpenseModel expense;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destiny_user_id", nullable = false)
    private UserModel destiny_user;

    @Column(name = "assigned_amount", nullable = false)
    private double assignedAmount;
}
