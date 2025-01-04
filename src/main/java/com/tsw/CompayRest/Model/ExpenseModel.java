package com.tsw.CompayRest.Model;

import com.tsw.CompayRest.Enum.ShareMethod;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "expenses")
public class ExpenseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "amount")
    private double amount;

    @Column(name = "expense_name")
    private String expense_name;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "expense_date")
    private LocalDateTime expense_date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_user")
    private UserModel origin_user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private GroupModel group;

    @Enumerated(EnumType.STRING)
    @Column(name = "share_method")
    private ShareMethod share_method;
}
