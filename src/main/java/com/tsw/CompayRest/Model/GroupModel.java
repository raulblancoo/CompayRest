package com.tsw.CompayRest.Model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="groups")
@Getter
@Setter
public class GroupModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private long id;

    @Column(name="groupName")
    private String groupName;

    @Column(name="imgURL")
    private String imgURL;

    @Column(name="amount")
    private double amount;

    @Enumerated
    @Column(name="currency")
    private String currency;
}
