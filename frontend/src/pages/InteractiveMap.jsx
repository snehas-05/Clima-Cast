import { useState } from 'react';
import TopBar from '../components/layout/TopBar';

const initialMarkers = [
  { top: '40%', left: '35%', temp: '74°', city: 'San Francisco', icon: 'sunny', color: 'text-primary' },
  { top: '25%', left: '55%', temp: '62°', city: 'London', icon: 'cloud', color: 'text-primary' },
  { top: '60%', left: '20%', temp: '88°', city: 'Miami', icon: 'thunderstorm', isError: true },
];

const initialStorms = [
  { name: 'Hurricane Elena', desc: 'Cat 4 • 145 mph', icon: 'cyclone', bg: 'bg-error-container/30', color: 'text-error' },
  { name: 'Storm T-420', desc: 'Monitoring Phase', icon: 'storm', bg: 'bg-secondary-container/30', color: 'text-primary', opacity: 'opacity-70' },
];

const initialLayers = [
  { id: 'precipitation', icon: 'rainy', label: 'Precipitation', active: true },
  { id: 'wind', icon: 'air', label: 'Wind Stream', active: false },
  { id: 'temp', icon: 'thermostat', label: 'Temperature', active: false },
  { id: 'satellite', icon: 'satellite_alt', label: 'Satellite View', active: false },
];

export default function InteractiveMap() {
  const [layers, setLayers] = useState(initialLayers);
  const [search, setSearch] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);

  const toggleLayer = (id) => {
    setLayers(prev => prev.map(l => 
      l.id === id ? { ...l, active: !l.active } : l
    ));
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      alert(`Searching for coordinates of: ${search}`);
    }
  };

  const handleZoom = (delta) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-100">
      {/* TopBar Overlay */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-transparent">
        <TopBar title="" subtitle="">
          <div className="hidden sm:flex glass-panel px-6 py-2 rounded-full w-[400px] shadow-lg absolute left-1/2 -translate-x-1/2 top-4 border-none bg-white/70">
            <span className="material-symbols-outlined text-primary">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-on-surface-variant w-full placeholder:text-outline ml-2 outline-none"
              placeholder="Search coordinates or city..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button onClick={() => alert("Voice search activated...")}>
              <span className="material-symbols-outlined text-outline-variant">mic</span>
            </button>
          </div>
        </TopBar>
      </div>

      {/* Map Background */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-500 ease-out"
        style={{ transform: `scale(${zoom})` }}
      >
        <img
          className="w-full h-full object-cover opacity-80"
          alt="Global Map"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9OO4bb_bP7aSS4BKONvam_TxYy41DnH8R-e0TdlhZw1_dZsE8dsrMyV-OoPkaIxnd_ZwzRDbXjsu9Tw4w3KBcvewSiJi1Wp9vki7N87D_T1cyFMxXlrU5qU3B5X7hz78ph0cSj-kPeM4NnbjMau6n-AMIJ_3LeXmotZjdmRBHNgGgWuLKL0VJlIFg905806xL4WFkpQLcMjqyVd8wTVCWbKhAHjq_HqQqUfYmgm02JsgPqAv-D7W6C2uLY2T63w9wBx21mJjg9mEb"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.4)_100%)] pointer-events-none" />
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <path d="M400,300 Q600,100 800,300" fill="none" stroke="rgba(103, 80, 164, 0.4)" strokeDasharray="8 8" strokeWidth="4" />
          <circle cx="800" cy="300" fill="rgba(103, 80, 164, 0.6)" r="10" />
        </svg>

        {/* Markers pinned to the scaled map container */}
        {initialMarkers.map((m) => (
          <div key={m.city} className="absolute z-10" style={{ top: m.top, left: m.left }}>
            <div 
              className="relative group cursor-pointer"
              onClick={() => alert(`Details for ${m.city}: Temp ${m.temp}, Condition ${m.icon}`)}
            >
              <div className={`px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-2 group-hover:scale-110 transition-transform
                ${m.isError ? 'bg-error/90 text-white' : 'glass-panel text-on-surface'}`}>
                <span className={`material-symbols-outlined text-sm ${m.isError ? '' : m.color}`} style={m.isError ? { fontVariationSettings: "'FILL' 1" } : {}}>{m.icon}</span>
                <span className="font-bold text-sm">{m.temp}</span>
                <span className="text-xs font-medium text-on-surface-variant">{m.city}</span>
              </div>
              <div className="w-1 h-8 bg-gradient-to-b from-white to-transparent mx-auto mt-0.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Right Controls */}
      <div className="absolute top-24 right-6 lg:right-10 flex flex-col gap-4 z-20">
        <div className="glass-panel p-4 rounded-3xl w-64 shadow-xl flex flex-col gap-4">
          <h3 className="text-label-caps text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">layers</span>
            MAP LAYERS
          </h3>
          <div className="flex flex-col gap-2">
            {layers.map((l) => (
              <button
                key={l.id}
                onClick={() => toggleLayer(l.id)}
                className={`flex items-center justify-between w-full p-2 rounded-xl transition-all
                  ${l.active ? 'bg-primary text-white' : 'hover:bg-secondary-container/20 text-on-surface'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg">{l.icon}</span>
                  <span className="text-sm font-medium">{l.label}</span>
                </div>
                {l.active && <span className="material-symbols-outlined text-sm">check</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="glass-panel flex flex-col rounded-2xl overflow-hidden self-end shadow-lg">
          <button 
            onClick={() => handleZoom(0.2)}
            className="p-3 hover:bg-white border-b border-white/50 text-primary transition-all"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button 
            onClick={() => handleZoom(-0.2)}
            className="p-3 hover:bg-white text-primary transition-all"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
      </div>

      {/* Active Storms */}
      <div className="absolute bottom-28 lg:bottom-10 left-6 lg:left-10 z-20">
        <div className="glass-panel p-6 rounded-[32px] w-80 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h3-card-title text-on-surface">Active Storms</h3>
            <span className="px-2 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-full">LIVE</span>
          </div>
          <div className="flex flex-col gap-4">
            {initialStorms.map((s) => (
              <div 
                key={s.name} 
                className={`flex items-center gap-4 p-3 rounded-2xl border border-white/20 bg-white/40 cursor-pointer hover:bg-white/60 transition-colors ${s.opacity || ''}`}
                onClick={() => alert(`Showing tracking data for ${s.name}...`)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.bg} ${s.color}`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-xs text-on-surface-variant">{s.desc}</p>
                </div>
                <span className="material-symbols-outlined text-outline ml-auto">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="absolute bottom-6 lg:bottom-10 right-6 lg:right-10 left-6 lg:left-[340px] z-20">
        <div className="glass-panel p-4 rounded-[24px] shadow-2xl flex flex-col sm:flex-row items-center gap-6">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-all shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <div className="flex-1 w-full">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-label-caps text-on-surface-variant">
                {isPlaying ? 'Playback Active' : 'Live Radar Playback'}
              </span>
              <span className="text-xs text-label-caps text-primary">Dec 24, 08:30 PM</span>
            </div>
            <div className="h-2 bg-secondary-container/20 rounded-full relative overflow-hidden">
              <div className={`absolute top-0 left-0 h-full w-[65%] bg-gradient-to-r from-primary to-[#00BCD4] rounded-full ${isPlaying ? 'animate-pulse' : ''}`} />
              <div className="absolute top-0 left-[65%] h-full w-1 bg-white shadow-sm z-10" />
            </div>
            <div className="hidden sm:flex justify-between mt-2 text-[10px] text-outline font-medium">
              <span>-12h</span><span>-8h</span><span>-4h</span>
              <span className="text-primary font-bold">Now</span>
              <span>+4h</span><span>+8h</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 border-l border-white/50 pl-6 shrink-0">
            <span className="material-symbols-outlined text-outline">speed</span>
            <span className="text-xs font-bold text-on-surface">1.0x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
