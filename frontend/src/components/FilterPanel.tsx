// UI controls to update the filtering criteria

import React from "react";
import type { Filters } from "../types/Filters";
import { Filter, X } from "lucide-react";

interface FilterPanelProps {
	filters: Filters;
	setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
	filters,
	setFilters,
}) => {
	const handleReset = () => {
		setFilters({
			minAltitude: 0,
			maxAltitude: 60000,
			minSpeed: 0,
			maxSpeed: 1000,
			country: "",
		});
	};

	return (
		<div className="absolute top-24 left-4 z-[400] w-72 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl text-slate-200">
			<div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
				<div className="flex items-center gap-2 text-blue-400 font-bold">
					<Filter size={18} />
					<h2>Target Filters</h2>
				</div>
				<button
					onClick={handleReset}
					className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
				>
					<X size={14} /> Reset
				</button>
			</div>

			<div className="space-y-4 text-sm">
				{/* Country Filter */}
				<div className="flex flex-col gap-1">
					<label className="text-slate-400 font-semibold text-xs uppercase">
						Origin Country
					</label>
					<input
						type="text"
						placeholder="e.g. United States"
						className="bg-slate-800 border border-slate-600 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 text-white"
						value={filters.country}
						onChange={(e) =>
							setFilters({ ...filters, country: e.target.value })
						}
					/>
				</div>

				{/* Altitude Filter */}
				<div className="flex flex-col gap-1">
					<label className="text-slate-400 font-semibold text-xs uppercase">
						Altitude (Feet)
					</label>
					<div className="flex items-center gap-2">
						<input
							type="number"
							className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 focus:outline-none"
							value={filters.minAltitude}
							onChange={(e) =>
								setFilters({
									...filters,
									minAltitude: Number(e.target.value),
								})
							}
						/>
						<span>to</span>
						<input
							type="number"
							className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 focus:outline-none"
							value={filters.maxAltitude}
							onChange={(e) =>
								setFilters({
									...filters,
									maxAltitude: Number(e.target.value),
								})
							}
						/>
					</div>
				</div>

				{/* Speed Filter */}
				<div className="flex flex-col gap-1">
					<label className="text-slate-400 font-semibold text-xs uppercase">
						Speed (Knots)
					</label>
					<div className="flex items-center gap-2">
						<input
							type="number"
							className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 focus:outline-none"
							value={filters.minSpeed}
							onChange={(e) =>
								setFilters({
									...filters,
									minSpeed: Number(e.target.value),
								})
							}
						/>
						<span>to</span>
						<input
							type="number"
							className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 focus:outline-none"
							value={filters.maxSpeed}
							onChange={(e) =>
								setFilters({
									...filters,
									maxSpeed: Number(e.target.value),
								})
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
