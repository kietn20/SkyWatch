// interface matching the backend Java model

export interface FlightState {
    icao24: string;
    callsign: string;
    originCountry: string;
    longitude: number;
    latitude: number;
    baroAltitude: number;
    velocity: number;
    trueTrack: number;
    onGround: boolean;
}