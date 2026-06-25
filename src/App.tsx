import React, { useState } from 'react';
import SpotifyPrototype from './components/SpotifyPrototype';
import { Radio } from 'lucide-react';

export default function App() {
  const [logs, setLogs] = useState<{ timestamp: string; action: string; detail: string }[]>([]);

  // Function to bridge live events from the player simulation
  const handleTrackAction = (action: string, detail: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      { timestamp: time, action, detail },
      ...prev.slice(0, 49)
    ]);
  };

  return (
    <div className="min-h-screen spotify-gradient text-white flex flex-col font-sans select-none antialiased selection:bg-spotify-green selection:text-black relative">
      
      {/* GLOBAL HEADER BAR */}
      <header className="bg-spotify-black/80 border-b border-white/5 py-4 px-6 sticky top-0 backdrop-blur-md z-40 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-spotify-green rounded-xl flex items-center justify-center text-spotify-black">
              <Radio className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-extrabold text-sm tracking-tight">Spotify Discovery Boost</span>
                <span className="px-2 py-0.5 bg-spotify-green/10 text-spotify-green text-[9px] font-black tracking-widest rounded-full uppercase">
                  V2 Prototype
                </span>
              </div>
              <p className="text-xs text-spotify-gray mt-0.5">Interactive Design Simulation</p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-spotify-gray border-l border-white/10 pl-6">
            <div>
              <span className="block text-[10px] uppercase font-black tracking-wider text-spotify-green">Personalization Zone</span>
              <p className="text-white font-bold mt-0.5">Subtle Synth & Indie Vibe</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-black tracking-wider text-spotify-green">Session Status</span>
              <p className="text-white font-bold mt-0.5">Awaiting Boost Blend</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="px-3 py-1.5 bg-spotify-green/10 border border-spotify-green/20 rounded-full text-spotify-green text-xs font-black uppercase tracking-wider">
            Prototype Active
          </div>

        </div>
      </header>

      {/* CENTERED LAYOUT WRAPPER */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 md:p-6 flex flex-col gap-6 justify-center items-center">
        
        {/* Device Mockup Frame */}
        <div className="w-full">
          <SpotifyPrototype 
            onTrackAction={handleTrackAction}
          />
        </div>

      </main>

      {/* STATIC FOOTER */}
      <footer className="bg-spotify-black/40 border-t border-white/5 py-3 px-6 text-center text-[10px] text-spotify-dark-gray mt-auto shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Spotify Discovery Boost evaluation mockup. For evaluation purposes only. No affiliation with Spotify AB.</span>
          <span>Designed under Lead PM & UX Core Specifications • June 2026</span>
        </div>
      </footer>

    </div>
  );
}
