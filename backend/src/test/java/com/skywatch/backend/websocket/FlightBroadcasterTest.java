// unit test to verify the scheduled broadcaster pushes data to the STOMP broker.

package com.skywatch.backend.websocket;

import com.skywatch.backend.model.FlightState;
import com.skywatch.backend.repository.FlightStateRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightBroadcasterTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private FlightStateRepository flightStateRepository;

    @InjectMocks
    private FlightBroadcaster flightBroadcaster;

    @Test
    void broadcastLiveFlights_shouldSendToTopic_whenFlightsExist() {
        // 1. Arrange: Mock Redis to return a list of 1 flight
        List<FlightState> mockFlights = List.of(FlightState.builder().icao24("a1b2c3").build());
        when(flightStateRepository.findAllActiveFlights()).thenReturn(mockFlights);

        // 2. Act: Trigger the broadcaster
        flightBroadcaster.broadcastLiveFlights();

        // 3. Assert: Verify the SimpMessagingTemplate sent the data to "/topic/flights"
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/flights"), eq(mockFlights));
    }

    @Test
    void broadcastLiveFlights_shouldNotSend_whenNoFlights() {
        // 1. Arrange: Mock Redis to return an empty list
        when(flightStateRepository.findAllActiveFlights()).thenReturn(Collections.emptyList());

        // 2. Act: Trigger the broadcaster
        flightBroadcaster.broadcastLiveFlights();

        // 3. Assert: Verify the SimpMessagingTemplate was NEVER called
        verify(messagingTemplate, never()).convertAndSend(anyString(), any(Object.class));
    }
}