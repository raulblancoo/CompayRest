package com.tsw.CompayRest.Model;

import com.tsw.CompayRest.Enum.Currency;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="groups")
public class GroupModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private long id;

    @Column(name="group_name")
    private String group_name;

    @Column(name="imgURL")
    private String imgURL;

    @Column(name="amount")
    private double amount;

    @Enumerated(EnumType.STRING)
    @Column(name="currency")
    private Currency currency;
}
