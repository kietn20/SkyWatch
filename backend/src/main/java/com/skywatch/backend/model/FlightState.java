// represents a single aircraft's state vector from OpenSky

package com.skywatch.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightState {
    private String icao24;
    private String callsign;
    private String originCountry;
    private double longitude;
    private double latitude;
    private double baroAltitude;    // meters
    private double velocity;        // meters per sec
    private double trueTrack;       // heading in degrees
    private boolean onGround;
}
