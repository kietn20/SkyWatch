// renders the Leaflet map and clusters markers to fix DOM lag

import React, { useEffect } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Polyline,
	useMap,
	useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { FlightState } from "../types/FlightState";
import type { FlightPosition } from "../types/FlightPosition";

interface FlightMapProps {
	flights: FlightState[];
	onFlightSelect: (flight: FlightState) => void;
	onGeofenceCreated: (bounds: L.LatLngBounds) => void;
	onGeofenceCleared: () => void;
	selectedFlight?: FlightState | null;
	flightTrail?: FlightPosition[];
}

const createPlaneIcon = (heading: number) => {
	return L.divIcon({
		className: "bg-transparent border-none",
		html: `<div style="transform: rotate(${heading}deg); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" class="w-6 h-6 drop-shadow-md hover:fill-amber-400 transition-colors cursor-pointer">
                   <path d="M3.1 11.2l6.5-1.9 4.3-7.5c.3-.5.9-.8 1.5-.8h1.2c.5 0 .8.5.6 1L15 8.5h4.6c.9 0 1.7.6 1.9 1.5.1.5-.1 1-.6 1.3l-2.4 1.4-1.6 4.9c-.2.5-.7.8-1.2.8H14.5c-.4 0-.8-.4-.7-.9l1.4-4.2-5.1-1.5-3.8 4.6c-.3.4-.9.6-1.4.6H3.6c-.5 0-.8-.5-.6-1l2.4-4.3-2.1-.6c-.5-.1-.8-.6-.6-1.1.2-.5.7-.8 1.2-.7z"/>
                 </svg>
               </div>`,
		iconSize: [24, 24],
		iconAnchor: [12, 12],
	});
};

type RuntimeLeaflet = typeof L & {
	Draw: {
		Event: {
			CREATED: string;
			DELETED: string;
		};
	};
	Control: typeof L.Control & {
		Draw: new (options: {
			position: string;
			draw: Record<string, boolean>;
			edit: { featureGroup: L.FeatureGroup };
		}) => L.Control;
	};
	FeatureGroup: new () => L.FeatureGroup;
};

const GeofenceDrawControl: React.FC<{
	onGeofenceCreated: (bounds: L.LatLngBounds) => void;
	onGeofenceCleared: () => void;
}> = ({ onGeofenceCreated, onGeofenceCleared }) => {
	const map = useMap();

	useEffect(() => {
		const runtimeLeaflet = (window as unknown as { L?: RuntimeLeaflet }).L;
		if (!runtimeLeaflet) {
			return;
		}

		const drawnItems = new runtimeLeaflet.FeatureGroup();
		map.addLayer(drawnItems);

		const drawControl = new runtimeLeaflet.Control.Draw({
			position: "topright",
			draw: {
				rectangle: true,
				polygon: false,
				circle: false,
				circlemarker: false,
				marker: false,
				polyline: false,
			},
			edit: {
				featureGroup: drawnItems,
			},
		});

		const handleCreated = (e: L.LeafletEvent & { layer: L.Layer }) => {
			drawnItems.clearLayers();
			drawnItems.addLayer(e.layer);
			if ("getBounds" in e.layer) {
				onGeofenceCreated((e.layer as L.Rectangle).getBounds());
			}
		};

		const handleDeleted = () => {
			onGeofenceCleared();
		};

		map.addControl(drawControl);
		map.on(runtimeLeaflet.Draw.Event.CREATED, handleCreated);
		map.on(runtimeLeaflet.Draw.Event.DELETED, handleDeleted);

		return () => {
			map.off(runtimeLeaflet.Draw.Event.CREATED, handleCreated);
			map.off(runtimeLeaflet.Draw.Event.DELETED, handleDeleted);
			map.removeControl(drawControl);
			map.removeLayer(drawnItems);
		};
	}, [map, onGeofenceCreated, onGeofenceCleared]);

	return null;
};

const AutoPanToSelection: React.FC<{ selectedFlight?: FlightState | null }> = ({
	selectedFlight,
}) => {
	const map = useMap();

	useEffect(() => {
		if (!selectedFlight) return;
		map.flyTo(
			[selectedFlight.latitude, selectedFlight.longitude],
			Math.max(map.getZoom(), 8),
			{
				animate: true,
				duration: 0.8,
			},
		);
	}, [map, selectedFlight]);

	return null;
};

const VisibleFlights: React.FC<{
	flights: FlightState[];
	onFlightSelect: (flight: FlightState) => void;
}> = ({ flights, onFlightSelect }) => {
	const map = useMap();
	const [bounds, setBounds] = React.useState(map.getBounds());

	useMapEvents({
		moveend: () => setBounds(map.getBounds()),
		zoomend: () => setBounds(map.getBounds()),
		load: () => setBounds(map.getBounds()),
	});

	const visibleFlights = React.useMemo(() => {
		const paddedBounds = bounds.pad(0.15);
		return flights.filter((flight) =>
			paddedBounds.contains([flight.latitude, flight.longitude]),
		);
	}, [bounds, flights]);

	return (
		<>
			{visibleFlights.map((flight) => (
				<Marker
					key={flight.icao24}
					position={[flight.latitude, flight.longitude]}
					icon={createPlaneIcon(flight.trueTrack)}
					eventHandlers={{ click: () => onFlightSelect(flight) }}
				/>
			))}
		</>
	);
};

const FlightTrail: React.FC<{ trail: FlightPosition[] }> = ({ trail }) => {
	if (trail.length < 2) return null;
	const path: [number, number][] = trail.map((point) => [
		point.latitude,
		point.longitude,
	]);
	return (
		<Polyline
			positions={path}
			pathOptions={{
				color: "#60a5fa",
				weight: 3,
				opacity: 0.85,
				dashArray: "6 8",
			}}
		/>
	);
};

export const FlightMap: React.FC<FlightMapProps> = ({
	flights,
	onFlightSelect,
	onGeofenceCreated,
	onGeofenceCleared,
	selectedFlight,
	flightTrail = [],
}) => {
	const center: [number, number] = [39.8283, -98.5795];

	return (
		<MapContainer
			center={center}
			zoom={5}
			style={{ height: "100%", width: "100%", zIndex: 0 }}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<AutoPanToSelection selectedFlight={selectedFlight} />

			<GeofenceDrawControl
				onGeofenceCreated={onGeofenceCreated}
				onGeofenceCleared={onGeofenceCleared}
			/>

			<FlightTrail trail={flightTrail} />

			<VisibleFlights flights={flights} onFlightSelect={onFlightSelect} />
		</MapContainer>
	);
};
