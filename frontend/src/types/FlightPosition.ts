export interface FlightPosition {
    id: number;
    icao24: string;
    callsign: string;
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    heading: number;
    recordedAt: string;
}