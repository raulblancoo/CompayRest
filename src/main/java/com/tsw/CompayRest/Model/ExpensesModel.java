package com.tsw.CompayRest.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="expenses")
public class ExpensesModel {

    @Column(name="id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="amount")
    private double amount;

    @Column(name="expense_name")
    private String expense_name;

    @Temporal(TemporalType.DATE)
    @Column(name="expense_date")
    private Date expense_date;

    @ManyToOne
    @JoinColumn(name = "FK_USER")
    private UserModel originUser;

    @ManyToOne
    @JoinColumn(name="FK_GROUP")
    private GroupModel group;

    @Enumerated
    @Column(name="share_method")
    private String share_method;
}
