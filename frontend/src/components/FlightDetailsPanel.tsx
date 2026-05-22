// displays real-time telemetry for the selected aircraft

import React from "react";
import type { FlightState } from "../types/FlightState";
import { Info, Plane, X, Gauge, ArrowUpRight, MapPin } from "lucide-react";

interface FlightDetailsProps {
	flight: FlightState | null;
	onClose: () => void;
}

export const FlightDetailsPanel: React.FC<FlightDetailsProps> = ({
	flight,
	onClose,
}) => {
	if (!flight) return null;

	return (
		<div className="absolute top-24 right-4 z-[400] w-80 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl text-slate-200 overflow-hidden flex flex-col">
			<div className="bg-slate-800/80 p-4 flex items-center justify-between border-b border-slate-700">
				<div className="flex items-center gap-3">
					<div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
						<Plane size={24} />
					</div>
					<div>
						<h2 className="font-bold text-xl leading-tight">
							{flight.callsign || "UNKNOWN"}
						</h2>
						<p className="text-xs text-slate-400 font-mono uppercase">
							ICAO: {flight.icao24}
						</p>
					</div>
				</div>
				<button
					onClick={onClose}
					className="text-slate-400 hover:text-white p-1"
				>
					<X size={20} />
				</button>
			</div>

			<div className="p-4 space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
						<p className="flex items-center gap-1 text-xs text-slate-400 font-semibold mb-1">
							<ArrowUpRight size={14} /> ALTITUDE
						</p>
						<p className="font-mono text-lg">
							{Math.round(flight.baroAltitude)}{" "}
							<span className="text-sm text-slate-500">ft</span>
						</p>
					</div>
					<div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
						<p className="flex items-center gap-1 text-xs text-slate-400 font-semibold mb-1">
							<Gauge size={14} /> SPEED
						</p>
						<p className="font-mono text-lg">
							{Math.round(flight.velocity)}{" "}
							<span className="text-sm text-slate-500">kts</span>
						</p>
					</div>
				</div>

				<div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 space-y-2">
					<p className="flex items-center gap-1 text-xs text-slate-400 font-semibold border-b border-slate-700 pb-1 mb-2">
						<MapPin size={14} /> TELEMETRY
					</p>
					<div className="flex justify-between text-sm font-mono">
						<span className="text-slate-500">Heading:</span>{" "}
						<span>{Math.round(flight.trueTrack)}&deg;</span>
					</div>
					<div className="flex justify-between text-sm font-mono">
						<span className="text-slate-500">Lat/Lon:</span>{" "}
						<span>
							{flight.latitude.toFixed(4)},{" "}
							{flight.longitude.toFixed(4)}
						</span>
					</div>
					<div className="flex justify-between text-sm font-mono">
						<span className="text-slate-500">Country:</span>{" "}
						<span>{flight.originCountry}</span>
					</div>
					<div className="flex justify-between text-sm font-mono">
						<span className="text-slate-500">Status:</span>{" "}
						<span
							className={
								flight.onGround
									? "text-amber-400"
									: "text-emerald-400"
							}
						>
							{flight.onGround ? "ON GROUND" : "AIRBORNE"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
