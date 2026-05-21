// bounding box coordinates for geofence

package com.skywatch.backend.model;

import lombok.Data;

@Data
public class GeofenceZone {
    private double minLat;
    private double maxLat;
    private double minLon;
    private double maxLon;
}
