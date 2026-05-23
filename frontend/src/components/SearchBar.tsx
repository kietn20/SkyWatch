import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import type { FlightPosition } from "../types/FlightPosition";
import type { FlightState } from "../types/FlightState";

interface SearchBarProps {
	onSelectResult: (flight: FlightState) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectResult }) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<FlightPosition[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		setIsSearching(true);
		try {
			const res = await fetch(
				`http://localhost:8080/api/flights/search?callsign=${encodeURIComponent(query)}`,
			);
			const data: FlightPosition[] = await res.json();
			setResults(data);
		} catch (error) {
			console.error("Search failed", error);
		} finally {
			setIsSearching(false);
		}
	};

	const handleSelect = (pos: FlightPosition) => {
		const mappedFlight: FlightState = {
			icao24: pos.icao24,
			callsign: pos.callsign,
			latitude: pos.latitude,
			longitude: pos.longitude,
			baroAltitude: pos.altitude,
			velocity: pos.velocity,
			trueTrack: pos.heading,
			originCountry: "Searched",
			onGround: false,
		};
		onSelectResult(mappedFlight);
		setResults([]);
		setQuery("");
	};

	return (
		<div className="relative">
			<form
				onSubmit={handleSearch}
				className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 focus-within:border-blue-500 transition-colors"
			>
				<Search size={16} className="text-slate-400 mr-2" />
				<input
					type="text"
					placeholder="Search Callsign (e.g. UAL)"
					className="bg-transparent border-none text-sm text-white focus:outline-none w-48"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				{isSearching && (
					<Loader2
						size={14}
						className="text-blue-500 animate-spin ml-2"
					/>
				)}
			</form>

			{results.length > 0 && (
				<div
					className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-72 overflow-y-auto"
					style={{ zIndex: 1000 }}
				>
					{results.map((r, i) => (
						<div
							key={`${r.icao24}-${r.recordedAt}-${i}`}
							onClick={() => handleSelect(r)}
							className="p-3 border-b border-slate-700 hover:bg-slate-700 cursor-pointer transition-colors"
						>
							<p className="font-bold text-blue-400 text-sm">
								{r.callsign}
							</p>
							<p className="text-xs text-slate-400 font-mono">
								ID: {r.icao24} | Alt: {Math.round(r.altitude)}{" "}
								ft
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
