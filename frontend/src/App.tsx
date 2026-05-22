import React, { useState, useMemo, useEffect } from "react";

import { Radar } from "lucide-react";
import { useWebSocket } from "./hooks/useWebSocket";
import type { FlightState } from "./types/FlightState";
import type { Filters } from "./types/Filters";
import { FilterPanel } from "./components/FilterPanel";
import { FlightDetailsPanel } from "./components/FlightDetailsPanel";
import { FlightMap } from "./components/FlightMap";

function App() {
	const { flights, isConnected } = useWebSocket();
	const [selectedFlight, setSelectedFlight] = useState<FlightState | null>(
		null,
	);

	// Default filter state
	const [filters, setFilters] = useState<Filters>({
		minAltitude: 0,
		maxAltitude: 60000,
		minSpeed: 0,
		maxSpeed: 1000,
		country: "",
	});

	// Client-side filtering logic
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

	// Mentor Moment Trick: Keep the selected flight's data updating live!
	useEffect(() => {
		if (selectedFlight) {
			const updatedFlight = flights.find(
				(f) => f.icao24 === selectedFlight.icao24,
			);
			if (updatedFlight) {
				setSelectedFlight(updatedFlight);
			} else {
				// If it disappears from the live feed, you could auto-close it, or keep the last known state.
				// We will keep the last known state for now.
			}
		}
	}, [flights]); // Run every time new WebSocket data arrives

	return (
		<div className="relative h-screen w-screen flex flex-col overflow-hidden bg-slate-900">
			{/* Header */}
			<header className="absolute top-0 left-0 right-0 z-[500] p-4 pointer-events-none">
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

			{/* UI Panels overlaying the map */}
			<FilterPanel filters={filters} setFilters={setFilters} />
			<FlightDetailsPanel
				flight={selectedFlight}
				onClose={() => setSelectedFlight(null)}
			/>

			{/* Map Container */}
			<main className="flex-1">
				<FlightMap
					flights={filteredFlights}
					onFlightSelect={setSelectedFlight}
				/>
			</main>
		</div>
	);
}

export default App;
