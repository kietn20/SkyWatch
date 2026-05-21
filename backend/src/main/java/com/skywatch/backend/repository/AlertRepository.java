package com.skywatch.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skywatch.backend.entity.Alert;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

}
