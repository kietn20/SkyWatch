// File: frontend/src/components/FlightMap.tsx
// Purpose: Renders the Leaflet map and clusters markers to fix DOM lag.

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'; // <--- NEW IMPORT
import L from 'leaflet';
import type { FlightState } from '../types/FlightState';

interface FlightMapProps {
    flights: FlightState[];
}

const createPlaneIcon = (heading: number) => {
    return L.divIcon({
        className: 'bg-transparent border-none',
        html: `<div style="transform: rotate(${heading}deg); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" class="w-6 h-6 drop-shadow-md">
                   <path d="M3.1 11.2l6.5-1.9 4.3-7.5c.3-.5.9-.8 1.5-.8h1.2c.5 0 .8.5.6 1L15 8.5h4.6c.9 0 1.7.6 1.9 1.5.1.5-.1 1-.6 1.3l-2.4 1.4-1.6 4.9c-.2.5-.7.8-1.2.8H14.5c-.4 0-.8-.4-.7-.9l1.4-4.2-5.1-1.5-3.8 4.6c-.3.4-.9.6-1.4.6H3.6c-.5 0-.8-.5-.6-1l2.4-4.3-2.1-.6c-.5-.1-.8-.6-.6-1.1.2-.5.7-.8 1.2-.7z"/>
                 </svg>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

export const FlightMap: React.FC<FlightMapProps> = ({ flights }) => {
    const center: [number, number] = [39.8283, -98.5795];

    return (
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* NEW: Wrap the Markers in the MarkerClusterGroup */}
            <MarkerClusterGroup 
                chunkedLoading={true} // Helps prevent freezing during the initial load
                maxClusterRadius={60} // Distance (in pixels) to group markers
            >
                {flights.map((flight) => (
                    <Marker 
                        key={flight.icao24} 
                        position={[flight.latitude, flight.longitude]}
                        icon={createPlaneIcon(flight.trueTrack)}
                    >
                        <Popup>
                            <div className="font-sans text-sm">
                                <strong className="text-blue-600 block text-lg">{flight.callsign}</strong>
                                <span className="text-gray-500 text-xs uppercase">{flight.icao24}</span>
                                <div className="mt-2 space-y-1">
                                    <p><b>Alt:</b> {Math.round(flight.baroAltitude)} ft</p>
                                    <p><b>Speed:</b> {Math.round(flight.velocity)} kts</p>
                                    <p><b>Heading:</b> {Math.round(flight.trueTrack)}&deg;</p>
                                    <p><b>Country:</b> {flight.originCountry}</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};