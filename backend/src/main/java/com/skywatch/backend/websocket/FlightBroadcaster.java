// polls Redis and broadcasts the entire map state to connected WebSocket clients

package com.skywatch.backend.websocket;

import com.skywatch.backend.model.FlightState;
import com.skywatch.backend.repository.FlightStateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlightBroadcaster {

    // SimpMessagingTemplate is Spring's utility for pushing STOMP messages
    private final SimpMessagingTemplate messagingTemplate;
    private final FlightStateRepository flightStateRepository;

    // run every 3 seconds
    @Scheduled(fixedRate = 3000)
    public void broadcastLiveFlights() {
        List<FlightState> activeFlights = flightStateRepository.findAllActiveFlights();
        
        if (!activeFlights.isEmpty()) {
            // push the list to anyone subscribed to /topic/flights
            messagingTemplate.convertAndSend("/topic/flights", activeFlights);
            
            // log.info("Broadcasted {} live flights to WebSocket clients.", activeFlights.size());
        }
    }
}