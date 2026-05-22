// Ensure Leaflet is loaded globally before running the leaflet-draw script
// The UMD bundles for Leaflet and Leaflet.draw are loaded via script tags in index.html.
// Here we just export the global `L.Draw` if available so imports like `import Draw from 'leaflet-draw'`
// work with packages that expect a default export.
const Draw = (typeof window !== 'undefined' && window.L && window.L.Draw) ? window.L.Draw : {};
export default Draw;
