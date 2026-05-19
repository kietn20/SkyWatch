package com.skywatch.backend.repository;

import com.skywatch.backend.entity.FlightPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightPositionRepository extends JpaRepository<FlightPosition, Long> {
}
