// unit test to verify mathematical conversions and database routing in the Consumer

package com.skywatch.backend.consumer;

import com.skywatch.backend.entity.FlightPosition;
import com.skywatch.backend.model.FlightState;
import com.skywatch.backend.repository.FlightPositionRepository;
import com.skywatch.backend.repository.FlightStateRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightConsumerTest {

    @Mock
    private FlightPositionRepository postgresRepository;

    @Mock
    private FlightStateRepository redisRepository;

    @InjectMocks
    private FlightConsumer flightConsumer;

    @Test
    void consumeFlight_shouldConvertUnitsAndSaveToBothStores() {
        // 1. Arrange: Create a raw flight with metric values
        // Altitude: 1000m -> Expected: 3280.84 ft
        // Velocity: 100 m/s -> Expected: 194.384 kts
        FlightState rawFlight = FlightState.builder()
                .icao24("a1b2c3")
                .callsign("AAL123")
                .baroAltitude(1000.0) 
                .velocity(100.0)      
                .trueTrack(180.0)
                .latitude(45.0)
                .longitude(-120.0)
                .build();

        // 2. Act: Run the consumer logic
        flightConsumer.consumeFlight(rawFlight);

        // 3. Assert & Verify Redis Routing
        ArgumentCaptor<FlightState> redisCaptor = ArgumentCaptor.forClass(FlightState.class);
        verify(redisRepository, times(1)).saveFlightState(redisCaptor.capture());
        
        FlightState redisSaved = redisCaptor.getValue();
        assertEquals(3280.84, redisSaved.getBaroAltitude(), 0.01);
        assertEquals(194.384, redisSaved.getVelocity(), 0.01);

        // 4. Assert & Verify PostgreSQL Routing
        ArgumentCaptor<FlightPosition> postgresCaptor = ArgumentCaptor.forClass(FlightPosition.class);
        verify(postgresRepository, times(1)).save(postgresCaptor.capture());
        
        FlightPosition postgresSaved = postgresCaptor.getValue();
        assertEquals(3280.84, postgresSaved.getAltitude(), 0.01);
        assertEquals(194.384, postgresSaved.getVelocity(), 0.01);
        assertEquals("AAL123", postgresSaved.getCallsign());
    }
}