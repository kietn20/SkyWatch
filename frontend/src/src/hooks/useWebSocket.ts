// Manages the STOMP WebSocket connection to the Spring Boot backend

import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import type { FlightState } from '../types/FlightState';

export const useWebSocket = () => {
    const [flights, setFlights] = useState<FlightState[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        // Initialize the STOMP client pointing to our Spring Boot endpoint
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket!');
                setIsConnected(true);

                // Subscribe to the topic. Every time Spring Boot calls convertAndSend(),
                // this callback fires.
                client.subscribe('/topic/flights', (message) => {
                    const data: FlightState[] = JSON.parse(message.body);
                    setFlights(data);
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setIsConnected(false);
            }
        });

        client.activate();

        // Cleanup function: disconnects when the component unmounts
        return () => {
            client.deactivate();
        };
    }, []);

    return { flights, isConnected };
};