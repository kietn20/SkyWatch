// exposes HTTP GET endpoints for search and history queries

package com.skywatch.backend.controller;

import com.skywatch.backend.entity.FlightPosition;
import com.skywatch.backend.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*") // Allows React to call these endpoints
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    // Endpoint: GET http://localhost:8080/api/flights/history/a1b2c3
    @GetMapping("/history/{icao24}")
    public ResponseEntity<List<FlightPosition>> getHistory(@PathVariable String icao24) {
        List<FlightPosition> history = flightService.getFlightHistory(icao24);
        return ResponseEntity.ok(history);
    }

    // Endpoint: GET http://localhost:8080/api/flights/search?callsign=UAL
    @GetMapping("/search")
    public ResponseEntity<List<FlightPosition>> searchFlights(@RequestParam String callsign) {
        if (callsign == null || callsign.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<FlightPosition> results = flightService.searchByCallsign(callsign);
        return ResponseEntity.ok(results);
    }
}