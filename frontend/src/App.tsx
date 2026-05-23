import { useState, useMemo, useEffect } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import { FlightMap } from "./components/FlightMap";
import { FilterPanel } from "./components/FilterPanel";
import { FlightDetailsPanel } from "./components/FlightDetailsPanel";
import { AlertContainer } from "./components/AlertContainer";
import { SearchBar } from "./components/SearchBar";
import type { FlightPosition } from "./types/FlightPosition";
import type { FlightState } from "./types/FlightState";
import type { Filters } from "./types/Filters";
import { Radar } from "lucide-react";
import L from "leaflet";

function App() {
	const { flights, alerts, isConnected, dismissAlert } = useWebSocket(); // Updated hook
	const [selectedFlight, setSelectedFlight] = useState<FlightState | null>(
		null,
	);
	const [flightTrail, setFlightTrail] = useState<FlightPosition[]>([]);

	const [filters, setFilters] = useState<Filters>({
		minAltitude: 0,
		maxAltitude: 60000,
		minSpeed: 0,
		maxSpeed: 1000,
		country: "",
	});

	const filteredFlights = useMemo(() => {
		return flights.filter(
			(f) =>
				f.baroAltitude >= filters.minAltitude &&
				f.baroAltitude <= filters.maxAltitude &&
				f.velocity >= filters.minSpeed &&
				f.velocity <= filters.maxSpeed &&
				(filters.country === "" ||
					f.originCountry
						.toLowerCase()
						.includes(filters.country.toLowerCase())),
		);
	}, [flights, filters]);

	useEffect(() => {
		if (selectedFlight) {
			const updatedFlight = flights.find(
				(f) => f.icao24 === selectedFlight.icao24,
			);
			if (updatedFlight) setSelectedFlight(updatedFlight);
		}
	}, [flights]);

	const handleGeofenceCreated = async (bounds: L.LatLngBounds) => {
		const payload = {
			minLat: bounds.getSouth(),
			maxLat: bounds.getNorth(),
			minLon: bounds.getWest(),
			maxLon: crossAntimeridianSafeLon(bounds.getEast()),
		};

		try {
			await fetch("http://localhost:8080/api/geofence", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			console.log("Geofence activated on backend.");
		} catch (error) {
			console.error("Failed to set geofence", error);
		}
	};

	const handleGeofenceCleared = async () => {
		try {
			await fetch("http://localhost:8080/api/geofence", {
				method: "DELETE",
			});
			console.log("Geofence cleared on backend.");
		} catch (error) {
			console.error("Failed to clear geofence", error);
		}
	};

	// Helper for map wrap-around issues
	const crossAntimeridianSafeLon = (lon: number) => {
		return lon > 180 ? lon - 360 : lon < -180 ? lon + 360 : lon;
	};

	const handleSelectResult = (flight: FlightState) => {
		setSelectedFlight(flight);
	};

	const handleSearchResults = (results: FlightPosition[]) => {
		setFlightTrail(results);
		if (results.length === 0) {
			return;
		}

		const latest = results[results.length - 1];
		setSelectedFlight({
			icao24: latest.icao24,
			callsign: latest.callsign,
			latitude: latest.latitude,
			longitude: latest.longitude,
			baroAltitude: latest.altitude,
			velocity: latest.velocity,
			trueTrack: latest.heading,
			originCountry: "Searched",
			onGround: false,
		});
	};

	return (
		<div className="relative h-screen w-screen flex flex-col overflow-hidden bg-slate-900">
			{/* Header */}
			<header
				className="absolute top-0 left-0 right-0 p-4 pointer-events-none"
				style={{ zIndex: 500 }}
			>
				<div className="max-w-7xl mx-auto flex justify-between items-center bg-slate-900/90 backdrop-blur-md shadow-lg rounded-xl p-4 pointer-events-auto border border-slate-700">
					<div className="flex items-center gap-3">
						<Radar
							className="text-blue-500 animate-[spin_4s_linear_infinite]"
							size={32}
						/>
						<div>
							<h1 className="text-2xl font-black tracking-tight text-white">
								SkyWatch{" "}
								<span className="text-blue-500">C4ISR</span>
							</h1>
							<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Real-Time Surveillance Dashboard
							</p>
						</div>
					</div>

					<div className="flex items-center gap-6">
						<SearchBar
							onSelectResult={handleSelectResult}
							onSearchResults={handleSearchResults}
						/>
						<div className="text-right">
							<p className="text-2xl font-bold text-white">
								{filteredFlights.length}
							</p>
							<p className="text-xs font-bold text-slate-400 uppercase">
								Tracked Targets
							</p>
						</div>
						<div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full">
							<div
								className={`w-3 h-3 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
							></div>
							<span className="text-sm font-bold text-slate-300">
								{isConnected ? "DATA LINK ACTIVE" : "NO SIGNAL"}
							</span>
						</div>
					</div>
				</div>
			</header>

			<FilterPanel filters={filters} setFilters={setFilters} />
			<FlightDetailsPanel
				flight={selectedFlight}
				onClose={() => setSelectedFlight(null)}
			/>

			<AlertContainer alerts={alerts} onDismiss={dismissAlert} />

			<main className="flex-1">
				<FlightMap
					flights={filteredFlights}
					onFlightSelect={setSelectedFlight}
					onGeofenceCreated={handleGeofenceCreated}
					onGeofenceCleared={handleGeofenceCleared}
					selectedFlight={selectedFlight}
					flightTrail={flightTrail}
				/>
			</main>
		</div>
	);
}

export default App;
