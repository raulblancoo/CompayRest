package com.tsw.CompayRest.Model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="users")
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private long id;

    @Column(name="name")
    private String name;

    @Column(name="surname")
    private String surname;

    @Column(name="username")
    private String username;

    @Column(name="email")
    private String email;

    @Column(name="password")
    private String password;

    @Column(name="avatarURL")
    private String avatarURL;

    @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<GroupModel> groups;

    @OneToMany(mappedBy = "destinyUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ExpenseShareModel> expenseShares;
}
