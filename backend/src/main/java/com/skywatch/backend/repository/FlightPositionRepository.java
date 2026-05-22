package com.skywatch.backend.repository;

import com.skywatch.backend.entity.FlightPosition;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightPositionRepository extends JpaRepository<FlightPosition, Long> {

    // 1. FOR THE TRAIL: Find all positions for a specific plane since a given time,
    // ordered chronologically.
    // Generates: SELECT * FROM flight_positions WHERE icao24 = ? AND recorded_at >
    // ? ORDER BY recorded_at ASC
    List<FlightPosition> findByIcao24AndRecordedAtAfterOrderByRecordedAtAsc(String icao24, LocalDateTime recordedAt);

    // 2. FOR THE SEARCH: Find the top 10 most recent records where the callsign
    // matches the search text.
    // Generates: SELECT * FROM flight_positions WHERE ILIKE %?% ORDER BY
    // recorded_at DESC LIMIT 10
    List<FlightPosition> findTop10ByCallsignContainingIgnoreCaseOrderByRecordedAtDesc(String callsign);
}
