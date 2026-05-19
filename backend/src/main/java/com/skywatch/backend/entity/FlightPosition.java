// database entity for storing historical flight positions in PostgreSQL

package com.skywatch.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "flight_positions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String icao24;
    private String callsign;
    private double latitude;
    private double longitude;
    private double altitude;    // in meters
    private double velocity;
    private double heading;

    private LocalDateTime recordedAt;
}
