import { useWebSocket } from './src/hooks/useWebSocket';
import { FlightMap } from './src/components/FlightMap';

function App() {
    const { flights, isConnected } = useWebSocket();

    return (
        <div className="relative h-screen w-screen flex flex-col overflow-hidden bg-slate-900">
            {/* Overlay Header */}
            <header className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/90 backdrop-blur shadow-lg rounded-xl p-4 pointer-events-auto border border-white/20">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-800">SkyWatch <span className="text-blue-600">C4ISR</span></h1>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Real-Time Surveillance Dashboard</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-bold text-slate-700">
                                {isConnected ? 'LIVE' : 'DISCONNECTED'}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-800">{flights.length}</p>
                            <p className="text-xs font-bold text-slate-500 uppercase">Tracked Targets</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Map Container */}
            <main className="flex-1">
                <FlightMap flights={flights} />
            </main>
        </div>
    );
}

export default App;