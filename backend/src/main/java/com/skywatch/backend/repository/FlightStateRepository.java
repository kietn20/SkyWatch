// handles saving flight state to Redis with a 60-second expiration

package com.skywatch.backend.repository;

import com.skywatch.backend.model.FlightState;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

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
}