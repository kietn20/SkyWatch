package com.skywatch.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skywatch.backend.model.GeofenceZone;
import com.skywatch.backend.service.GeofenceService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/geofence")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class GeofenceController {
    
    private final GeofenceService geofenceService;

    @PostMapping()
    public ResponseEntity<String> setGeofence(@RequestBody GeofenceZone zone) {
        geofenceService.setActiveZone(zone);
        return ResponseEntity.ok("Geofence activated");
    }

    @DeleteMapping
    public ResponseEntity<String> clearGeofence() {
        geofenceService.setActiveZone(null);
        return ResponseEntity.ok("Geofence cleared");
    }
    
}
