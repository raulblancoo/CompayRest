package com.tsw.CompayRest.Model;

import com.tsw.CompayRest.Enum.Currency;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

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

//    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
//    @JoinTable(
//            name = "group_members",
//            joinColumns = @JoinColumn(name = "group_id"),
//            inverseJoinColumns = @JoinColumn(name = "user_id")
//    )
//    private Set<UserModel> users;

//    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<GroupMemberModel> members;
}
