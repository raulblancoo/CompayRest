package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserModel, Long> {
}
