// sends FlightState objects to the "raw-flights" Kafka topic

package com.skywatch.backend.producer;

import com.skywatch.backend.model.FlightState;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlightProducer {

    private final KafkaTemplate<String, FlightState> kafkaTemplate;
    private static final String TOPIC = "raw-flights";

    public void sendFlightState(FlightState state) {
        // use icao24 as 'key'
        // In kafka, all msgs with the same key goes to the same partition,
        // ensuring they are processed in chronological order
        kafkaTemplate.send(TOPIC, state.getIcao24(), state);
    }
}
