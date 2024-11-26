package com.tsw.CompayRest.Model;

import jakarta.persistence.*;

import lombok.*;

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

    @Column(/*unique=true, */name="email")
    private String email;

    @Column(name="password")
    private String password;

    @Column(name="avatarURL")
    private String avatarURL;
}

