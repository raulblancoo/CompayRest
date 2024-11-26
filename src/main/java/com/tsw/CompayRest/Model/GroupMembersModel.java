package com.tsw.CompayRest.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="groupmembers")
public class GroupMembersModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private long id;

    @ManyToOne(cascade = CascadeType.MERGE)
    private UserModel user;

    @ManyToOne(cascade = CascadeType.MERGE)
    private GroupModel group;
}


