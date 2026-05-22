// renders a floating stack of alert toasts

import React from "react";
import type { Alert } from "../types/Alert";
import { ShieldAlert, ShieldCheck, X } from "lucide-react";

interface AlertContainerProps {
	alerts: Alert[];
	onDismiss: (index: number) => void;
}

export const AlertContainer: React.FC<AlertContainerProps> = ({
	alerts,
	onDismiss,
}) => {
	return (
		<div className="absolute bottom-6 right-6 z-[600] flex flex-col gap-3 w-80">
			{alerts.map((alert, idx) => {
				const isEnter = alert.type === "ENTER";
				return (
					<div
						key={idx}
						className={`p-4 rounded-xl border shadow-2xl backdrop-blur-md flex gap-3 animate-in slide-in-from-right-8 duration-300 ${
							isEnter
								? "bg-red-950/90 border-red-500/50 text-red-100"
								: "bg-emerald-950/90 border-emerald-500/50 text-emerald-100"
						}`}
					>
						<div
							className={`mt-1 ${isEnter ? "text-red-400 animate-pulse" : "text-emerald-400"}`}
						>
							{isEnter ? (
								<ShieldAlert size={24} />
							) : (
								<ShieldCheck size={24} />
							)}
						</div>
						<div className="flex-1">
							<div className="flex justify-between items-start">
								<h4 className="font-bold text-sm tracking-wide">
									ZONE {alert.type}
								</h4>
								<button
									onClick={() => onDismiss(idx)}
									className="opacity-50 hover:opacity-100"
								>
									<X size={16} />
								</button>
							</div>
							<p className="font-mono text-lg font-bold mt-1">
								{alert.callsign || alert.icao24}
							</p>
							<p className="text-xs opacity-70 mt-1">
								ALT: {Math.round(alert.altitude)} ft
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};
