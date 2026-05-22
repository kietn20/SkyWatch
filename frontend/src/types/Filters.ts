// defines the criteria for client-side filtering

export interface Filters {
    minAltitude: number; // in feet
    maxAltitude: number; 
    minSpeed: number;    // in knots
    maxSpeed: number;
    country: string;
}