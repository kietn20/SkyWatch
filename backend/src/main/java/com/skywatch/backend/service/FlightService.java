package com.skywatch.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.skywatch.backend.entity.FlightPosition;
import com.skywatch.backend.repository.FlightPositionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlightService {
    
    private final FlightPositionRepository repository;

    public List<FlightPosition> getFlightHistory(String icao24) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        return repository.findByIcao24AndRecordedAtAfterOrderByRecordedAtAsc(icao24, oneHourAgo);
    }

    public List<FlightPosition> searchByCallsign(String callsign) {
        return repository.findTop10ByCallsignContainingIgnoreCaseOrderByRecordedAtDesc(callsign);
    }

}
