export interface Alert {
    id?: number;
    icao24: string;
    callsign: string;
    type: 'ENTER' | 'EXIT';
    latitude: number;
    longitude: number;
    altitude: number;
    timestamp: string;
}