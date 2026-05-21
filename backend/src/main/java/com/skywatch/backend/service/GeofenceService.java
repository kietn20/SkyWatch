// evaluates flight coordinates against the active geofence and dispatches alerts

package com.skywatch.backend.service;

import com.skywatch.backend.entity.Alert;
import com.skywatch.backend.model.FlightState;
import com.skywatch.backend.model.GeofenceZone;
import com.skywatch.backend.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeofenceService {

    private final AlertRepository alertRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    // using just 1 for now
    private GeofenceZone activeZone;

    public void setActiveZone(GeofenceZone zone) {
        this.activeZone = zone;
        log.info("New Geofence Zone established: {}", zone);
    }

    public GeofenceZone getActiveZone() {
        return activeZone;
    }

    public void evaluateFlight(FlightState oldState, FlightState newState) {
        if (activeZone == null) return; // No zone drawn yet

        boolean wasInside = isInside(oldState);
        boolean isInside = isInside(newState);

        if (!wasInside && isInside) {
            triggerAlert(newState, "ENTER");
        } else if (wasInside && !isInside) {
            triggerAlert(newState, "EXIT");
        }
    }

    // simple bounding box check
    private boolean isInside(FlightState state) {
        if (state == null) return false;
        return state.getLatitude() >= activeZone.getMinLat() &&
               state.getLatitude() <= activeZone.getMaxLat() &&
               state.getLongitude() >= activeZone.getMinLon() &&
               state.getLongitude() <= activeZone.getMaxLon();
    }

    private void triggerAlert(FlightState state, String type) {
        log.warn("🚨 GEOFENCE {}: {} ({})", type, state.getCallsign(), state.getIcao24());

        // 1. Save to Database
        Alert alert = Alert.builder()
                .icao24(state.getIcao24())
                .callsign(state.getCallsign())
                .type(type)
                .latitude(state.getLatitude())
                .longitude(state.getLongitude())
                .altitude(state.getBaroAltitude())
                .timestamp(LocalDateTime.now())
                .build();
        alertRepository.save(alert);

        // 2. Push to WebSocket clients instantly
        messagingTemplate.convertAndSend("/topic/alerts", alert);
    }
}