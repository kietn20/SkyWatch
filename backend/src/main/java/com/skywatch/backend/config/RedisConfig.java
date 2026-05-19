// configures how Java objects are serialized into Redis

package com.skywatch.backend.config;

import com.skywatch.backend.model.FlightState;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, FlightState> flightRedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, FlightState> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Use Strings for Redis keys (e.g., "flight:a1b2c3")
        template.setKeySerializer(new StringRedisSerializer());
        
        // Use JSON for the Redis values (the FlightState object)
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(FlightState.class));
        
        return template;
    }
}