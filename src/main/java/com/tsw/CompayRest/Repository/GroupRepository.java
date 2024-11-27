package com.tsw.CompayRest.Repository;

import com.tsw.CompayRest.Model.GroupModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<GroupModel, Long> {
}