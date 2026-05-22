// Manages the STOMP WebSocket connection to the Spring Boot backend

// File: frontend/src/hooks/useWebSocket.ts
// (Update the existing file entirely)

import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import type { FlightState } from '../types/FlightState';
import type { Alert } from '../types/Alert';

export const useWebSocket = () => {
    const [flights, setFlights] = useState<FlightState[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket!');
                setIsConnected(true);

                // 1. Subscribe to Live Flights
                client.subscribe('/topic/flights', (message) => {
                    const data: FlightState[] = JSON.parse(message.body);
                    setFlights(data);
                });

                // 2. Subscribe to Geofence Alerts
                client.subscribe('/topic/alerts', (message) => {
                    const newAlert: Alert = JSON.parse(message.body);
                    // Add new alert to the top, keep only the latest 5
                    setAlerts(prev => [newAlert, ...prev].slice(0, 5));
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            }
        });

        client.activate();
        return () => { client.deactivate(); };
    }, []);

    // Provide a way to manually dismiss an alert
    const dismissAlert = (index: number) => {
        setAlerts(prev => prev.filter((_, i) => i !== index));
    };

    return { flights, alerts, isConnected, dismissAlert };
};