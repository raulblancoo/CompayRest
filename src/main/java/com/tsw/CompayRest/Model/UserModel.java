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
    @Column(name = "id")
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "avatarURL")
    private String avatarURL;

//    // TODO: mirar si realmente lo necesito
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<GroupMemberModel> memberships;
//    // TODO: mirar si realmente lo necesito
//    @OneToMany(mappedBy = "destinyUser", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<ExpenseShareModel> expenseShares;
}
