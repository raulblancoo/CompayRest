//package com.tsw.CompayRest.Model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Data
//@Table(name="groupmembers")
//public class GroupMemberModel {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name="id")
//    private long id;
//
//    @ManyToOne(cascade = CascadeType.MERGE)
//    private UserModel user;
//
//    @ManyToOne(cascade = CascadeType.MERGE)
//    private GroupModel group;
//}
//
//
