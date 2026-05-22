import * as LeafletNS from '../../node_modules/leaflet/dist/leaflet-src.esm.js';

export * from '../../node_modules/leaflet/dist/leaflet-src.esm.js';

const Leaflet = { ...LeafletNS };
const globalLeaflet = typeof window !== 'undefined' ? window.L : undefined;

if (globalLeaflet) {
	if (globalLeaflet.Draw) {
		Leaflet.Draw = globalLeaflet.Draw;
	}
	if (globalLeaflet.Control && globalLeaflet.Control.Draw) {
		LeafletNS.Control.Draw = globalLeaflet.Control.Draw;
		Leaflet.Control = LeafletNS.Control;
	}
	if (globalLeaflet.GeometryUtil) {
		Leaflet.GeometryUtil = globalLeaflet.GeometryUtil;
	}
	if (globalLeaflet.Toolbar) {
		Leaflet.Toolbar = globalLeaflet.Toolbar;
	}
	if (globalLeaflet.DrawToolbar) {
		Leaflet.DrawToolbar = globalLeaflet.DrawToolbar;
	}
	if (globalLeaflet.EditToolbar) {
		Leaflet.EditToolbar = globalLeaflet.EditToolbar;
	}
}

export default Leaflet;