package com.tsw.CompayRest.Model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="users")
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
}
