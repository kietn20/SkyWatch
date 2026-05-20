// renders the Leaflet map and clusters markers to fix DOM lag

import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import type { FlightState } from '../types/FlightState';

interface FlightMapProps {
    flights: FlightState[];
    onFlightSelect: (flight: FlightState) => void; // <--- NEW PROP
}

const createPlaneIcon = (heading: number) => {
    return L.divIcon({
        className: 'bg-transparent border-none',
        html: `<div style="transform: rotate(${heading}deg); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" class="w-6 h-6 drop-shadow-md hover:fill-amber-400 transition-colors cursor-pointer">
                   <path d="M3.1 11.2l6.5-1.9 4.3-7.5c.3-.5.9-.8 1.5-.8h1.2c.5 0 .8.5.6 1L15 8.5h4.6c.9 0 1.7.6 1.9 1.5.1.5-.1 1-.6 1.3l-2.4 1.4-1.6 4.9c-.2.5-.7.8-1.2.8H14.5c-.4 0-.8-.4-.7-.9l1.4-4.2-5.1-1.5-3.8 4.6c-.3.4-.9.6-1.4.6H3.6c-.5 0-.8-.5-.6-1l2.4-4.3-2.1-.6c-.5-.1-.8-.6-.6-1.1.2-.5.7-.8 1.2-.7z"/>
                 </svg>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

export const FlightMap: React.FC<FlightMapProps> = ({ flights, onFlightSelect }) => {
    const center: [number, number] = [39.8283, -98.5795];

    return (
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup chunkedLoading={true} maxClusterRadius={60}>
                {flights.map((flight) => (
                    <Marker 
                        key={flight.icao24} 
                        position={[flight.latitude, flight.longitude]}
                        icon={createPlaneIcon(flight.trueTrack)}
                        eventHandlers={{ click: () => onFlightSelect(flight) }} // <--- NEW CLICK HANDLER
                    />
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};