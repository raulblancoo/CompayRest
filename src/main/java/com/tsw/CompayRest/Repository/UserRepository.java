package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByEmailIn(List<String> emails);
}
