// Unit test for the data mapping logic using Mockito

package com.skywatch.backend.service;

import com.skywatch.backend.model.FlightState;
import com.skywatch.backend.producer.FlightProducer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OpenSkyServiceTest {

    @Mock
    private FlightProducer flightProducer;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private OpenSkyService openSkyService;

    @Test
    void pollOpenSky_shouldMapAndSendToProducer() {
        // 1. Prepare Mock Data (Simulating OpenSky's response structure)
        // Indices: 0=icao, 1=callsign, 2=origin, 5=lon, 6=lat, 7=alt, 8=ground, 9=vel, 10=track
        List<Object> mockFlight = List.of("a1b2c3", "UAL123 ", "USA", 0, 0, -122.1, 47.1, 1000.0, false, 250.0, 180.0);
        Map<String, Object> mockResponse = Map.of("states", List.of(mockFlight));

        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenReturn(mockResponse);

        // 2. Execute the method
        openSkyService.pollOpenSky();

        // 3. Verify the producer was called with the correctly mapped object
        ArgumentCaptor<FlightState> captor = ArgumentCaptor.forClass(FlightState.class);
        verify(flightProducer, times(1)).sendFlightState(captor.capture());

        FlightState result = captor.getValue();
        assertEquals("a1b2c3", result.getIcao24());
        assertEquals("UAL123", result.getCallsign()); // should be trimmed
        assertEquals(-122.1, result.getLongitude());
        assertEquals(47.1, result.getLatitude());
    }
}
