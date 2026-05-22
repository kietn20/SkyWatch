// consumes raw flights, normalizes units, and persists to Redis and Postgres

package com.skywatch.backend.consumer;

import com.skywatch.backend.entity.FlightPosition;
import com.skywatch.backend.model.FlightState;
import com.skywatch.backend.repository.FlightPositionRepository;
import com.skywatch.backend.repository.FlightStateRepository;
import com.skywatch.backend.service.GeofenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlightConsumer {

    private final FlightPositionRepository postgresRepository;
    private final FlightStateRepository redisRepository;
    private final GeofenceService geofenceService;

    // conversion constants
    private static final double METERS_TO_FEET = 3.28084;
    private static final double MS_TO_KNOTS = 1.94384;

    @KafkaListener(topics = "raw-flights", groupId = "skywatch-group")
    public void consumeFlight(FlightState rawFlight) {
        // 1. Normalize Data (Metric to Aviation Standard)
        double altFeet = rawFlight.getBaroAltitude() * METERS_TO_FEET;
        double speedKnots = rawFlight.getVelocity() * MS_TO_KNOTS;

        // update to new values
        rawFlight.setBaroAltitude(altFeet);
        rawFlight.setVelocity(speedKnots);


        // Geofence logic
        // Fetch the PREVIOUS state from Redis before we overwrite it
        FlightState oldState = redisRepository.getFlightState(rawFlight.getIcao24());
        // Let the GeofenceService decide if an alert should be triggered
        geofenceService.evaluateFlight(oldState, rawFlight);



        // 2. Save to Redis (Hot Store - Latest state only)
        redisRepository.saveFlightState(rawFlight);

        // 3. Save to PostgreSQL (Cold Store - Historical trail)
        FlightPosition position = FlightPosition.builder()
                .icao24(rawFlight.getIcao24())
                .callsign(rawFlight.getCallsign())
                .latitude(rawFlight.getLatitude())
                .longitude(rawFlight.getLongitude())
                .altitude(altFeet)
                .velocity(speedKnots)
                .heading(rawFlight.getTrueTrack())
                .recordedAt(LocalDateTime.now())
                .build();

        postgresRepository.save(position);
        
        // log.info("Processed flight {} - Alt: {} ft, Speed: {} kts", rawFlight.getIcao24(), altFeet, speedKnots);
    }
}