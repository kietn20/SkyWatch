// polls opensky api and routes data to the producer

package com.skywatch.backend.service;

import com.skywatch.backend.model.FlightState;
import com.skywatch.backend.producer.FlightProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenSkyService {

    private final FlightProducer flightProducer;
    private final RestTemplate restTemplate = new RestTemplate();

    // bounding box for USA to limit data volume
    private static final String OPENSKY_URL = "https://opensky-network.org/api/states/all?lamin=24.0&lomin=-125.0&lamax=49.0&lomax=-66.0";

    @Scheduled(fixedRate = 10000) // runs every 10,000ms (10 seconds)
    public void pollOpenSky() {
        try {
            log.info("Polling OpenSky API...");
            Map<String, Object> response = restTemplate.getForObject(OPENSKY_URL, Map.class);

            if (response != null && response.containsKey("states")) {
                List<List<Object>> states = (List<List<Object>>) response.get("states");

                if (states != null) {
                    log.info("Fetched {} aircraft states.", states.size());
                    for (List<Object> s : states) {
                        FlightState flight = mapToFlightState(s);
                        flightProducer.sendFlightState(flight);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error polling OpenSky: {}", e.getMessage());
        }
    }

    private FlightState mapToFlightState(List<Object> s) {
        // OpenSky index mapping: 0=icao24, 1=callsign, 2=origin, 5=lon, 6=lat, 7=baro_alt, 8=on_ground, 9=velocity, 10=heading
        return FlightState.builder()
                .icao24((String) s.get(0))
                .callsign(s.get(1) != null ? ((String) s.get(1)).trim() : "UNKNOWN")
                .originCountry((String) s.get(2))
                .longitude(parseToDouble(s.get(5)))
                .latitude(parseToDouble(s.get(6)))
                .baroAltitude(parseToDouble(s.get(7)))
                .onGround((Boolean) s.get(8))
                .velocity(parseToDouble(s.get(9)))
                .trueTrack(parseToDouble(s.get(10)))
                .build();
    }

    private double parseToDouble(Object obj) {
        if (obj instanceof Number) return ((Number) obj).doubleValue();
        return 0.0;
    }
}