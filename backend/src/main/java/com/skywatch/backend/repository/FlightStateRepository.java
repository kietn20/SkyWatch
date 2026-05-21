// handles saving flight state to Redis with a 60-second expiration

package com.skywatch.backend.repository;

import com.skywatch.backend.model.FlightState;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class FlightStateRepository {

    private final RedisTemplate<String, FlightState> redisTemplate;
    private static final String KEY_PREFIX = "flight:";

    public void saveFlightState(FlightState state) {
        String key = KEY_PREFIX + state.getIcao24();
        // Save to Redis and set it to expire in 60 seconds
        redisTemplate.opsForValue().set(key, state, Duration.ofSeconds(60));
    }

    public List<FlightState> findAllActiveFlights() {
        Set<String> keys = redisTemplate.keys(KEY_PREFIX + "*");
        if (keys == null || keys.isEmpty()) {
            return Collections.emptyList();
        }

        List<FlightState> flights = redisTemplate.opsForValue().multiGet(keys);

        return flights == null ? Collections.emptyList() : 
            flights.stream().filter(Objects::nonNull).collect(Collectors.toList());
    }

    public FlightState getFlightState(String icao24) {
        String key = KEY_PREFIX + icao24;
        return redisTemplate.opsForValue().get(key);
    }
}