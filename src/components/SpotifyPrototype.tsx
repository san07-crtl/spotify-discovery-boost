import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, 
  ListMusic, Sparkles, HelpCircle, Sliders, ChevronLeft, Trash2, 
  Settings, Share2, Check, Plus, Compass, Flame, Music, RotateCcw,
  Volume2, Shield, Radio, Sparkle, X, HeartHandshake, Zap,
  Leaf, Waves
} from 'lucide-react';
import { Song } from '../types';
import { INITIAL_SONGS, BOOST_POOL, WEEKEND_POOL } from '../data/songs';
import { motion, AnimatePresence } from 'motion/react';

interface PrototypeProps {
  onTrackAction: (actionName: string, detail: string) => void;
}

export default function SpotifyPrototype({ onTrackAction }: PrototypeProps) {
  const currentFlow = 'revised';
  // --- STATE ---
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongId, setCurrentSongId] = useState<string>('s0');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(35); // percentage (0 - 100)
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [playHistory, setPlayHistory] = useState<string[]>([]);
  
  // Feature states
  const [isBoostActive, setIsBoostActive] = useState<boolean>(false);
  const [boostIntensity, setBoostIntensity] = useState<'subtle' | 'balanced' | 'adventurous'>('balanced');
  const [dismissedFeedback, setDismissedFeedback] = useState<Set<string>>(new Set());
  const [showTriggerBanner, setShowTriggerBanner] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Interactive UI states
  const [activeScreen, setActiveScreen] = useState<'player' | 'queue'>('player');
  const [showTriggerSheet, setShowTriggerSheet] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState<boolean>(false);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [showWhySheet, setShowWhySheet] = useState<boolean>(false);
  const [showPlaylistSheet, setShowPlaylistSheet] = useState<boolean>(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState<boolean>(false);
  
  // Timer ref for progress
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- INITIALIZE ---
  useEffect(() => {
    resetPrototype();
  }, []);

  // Handle auto-playing progress timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 100;
          }
          return prev + 1; // slow tick
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSongId, songs]);

  // Handle song completion when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && isPlaying) {
      handleNextSong();
      setProgress(0);
    }
  }, [progress, isPlaying]);

  // Mock a trigger banner appearing after 4 seconds of listening to encourage the user
  useEffect(() => {
    const triggerTimeout = setTimeout(() => {
      if (!isBoostActive) {
        setShowTriggerBanner(true);
        onTrackAction('System Event', 'Repetitive listening detected. Triggering Discovery Boost prompt.');
      }
    }, 4000);
    return () => clearTimeout(triggerTimeout);
  }, [isBoostActive]);

  const resetPrototype = () => {
    setIsPlaying(false);
    setProgress(35);
    setIsBoostActive(false);
    setDismissedFeedback(new Set());
    setPlayHistory([]);
    setSongs(JSON.parse(JSON.stringify(INITIAL_SONGS))); // Deep copy initial
    setCurrentSongId('s0');
    setLikedSongs(new Set());
    setShowTriggerBanner(false);
    setShowTriggerSheet(false);
    setShowOnboarding(false);
    setShowOptionsSheet(false);
    setShowWhySheet(false);
    setShowPlaylistSheet(false);
    setShowSuccessOverlay(false);
    onTrackAction('Reset Simulation', 'Simulation restarted.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- CORE AUDIO SIMULATION ---
  const getCurrentSong = (): Song => {
    return songs.find(s => s.id === currentSongId) || songs[0] || INITIAL_SONGS[0];
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    onTrackAction(isPlaying ? 'Pause Track' : 'Play Track', `User toggled playback for "${getCurrentSong().title}"`);
  };

  const handleNextSong = () => {
    const activeSongs = songs.filter(s => s.visible);
    const currentIndex = activeSongs.findIndex(s => s.id === currentSongId);
    
    if (currentIndex < activeSongs.length - 1) {
      setPlayHistory(prev => [...prev, currentSongId]);
      const nextSong = activeSongs[currentIndex + 1];
      setCurrentSongId(nextSong.id);
      setProgress(0);
      onTrackAction('Skip Forward', `Now playing "${nextSong.title}" by ${nextSong.artist}`);
      
      // If the next song is a discovery track, log it
      if (nextSong.type === 'discovered' || nextSong.type === 'weekend') {
        onTrackAction('Discovery Song Impression', `Discovered song "${nextSong.title}" is now actively playing.`);
      }
    } else {
      setIsPlaying(false);
      setProgress(100);
      showToast('End of active queue');
      onTrackAction('Queue Completed', 'Reached the end of the simulated track list.');
    }
  };

  const handlePrevSong = () => {
    if (playHistory.length > 0) {
      const prevHistory = [...playHistory];
      const prevId = prevHistory.pop()!;
      setPlayHistory(prevHistory);
      setCurrentSongId(prevId);
      setProgress(0);
      onTrackAction('Skip Backward', `Returned to "${songs.find(s => s.id === prevId)?.title}"`);
    } else {
      setProgress(0);
      showToast('First song in queue');
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.round((clickX / rect.width) * 100);
    setProgress(percentage);
    onTrackAction('Seek Playback', `User seeked to ${percentage}% of song duration.`);
  };

  // --- ACTIONS ---
  const handleLikeSong = (songId: string, source: string) => {
    const isLiking = !likedSongs.has(songId);
    const updated = new Set(likedSongs);
    if (isLiking) {
      updated.add(songId);
      // Success modal triggered ONLY in revised flow for discovery songs
      const targetSong = songs.find(s => s.id === songId);
      if (currentFlow === 'revised' && targetSong && (targetSong.type === 'discovered' || targetSong.type === 'weekend')) {
        setShowSuccessOverlay(true);
        onTrackAction('Discovery Success Event', `User loved discovered track "${targetSong.title}". Triggering celebration burst.`);
      } else {
        showToast('Added to Liked Songs');
        onTrackAction('Liked Song', `Liked "${targetSong?.title}" via ${source}`);
      }
    } else {
      updated.delete(songId);
      showToast('Removed from Liked Songs');
      onTrackAction('Unliked Song', `Removed "${songs.find(s => s.id === songId)?.title}" from Liked Songs`);
    }
    setLikedSongs(updated);
  };

  // --- BOOST ACTIVATION ---
  const handleTriggerClick = () => {
    setShowTriggerBanner(false);
    setShowOnboarding(true);
    onTrackAction('Prompt Viewed', 'Viewing Revised micro-onboarding layout with settings.');
  };



  const handleActivateRevisedBoost = () => {
    setIsBoostActive(true);
    setShowOnboarding(false);
    
    const updatedSongs = [...songs];
    const mainPool = JSON.parse(JSON.stringify(BOOST_POOL)) as Song[];
    const wkPool = JSON.parse(JSON.stringify(WEEKEND_POOL)) as Song[];
    
    // Decide number of tracks based on intensity
    let numTracks = 2;
    if (boostIntensity === 'subtle') numTracks = 1;
    if (boostIntensity === 'adventurous') numTracks = 4;
    
    const selectedTracks = mainPool.slice(0, numTracks);
    
    // Add 1 weekend track too for extra high-fidelity if adventurous/balanced
    if (boostIntensity !== 'subtle') {
      selectedTracks.push(wkPool[0]);
    }
    
    // Smart Slotting: Insert with strategic spacing so it doesn't disrupt immediately
    selectedTracks.forEach((ds, idx) => {
      ds.visible = true;
      // Spaced nicely: insert after index 1, 3, 5 etc.
      const insertAt = (idx * 2) + 2;
      if (insertAt < updatedSongs.length) {
        updatedSongs.splice(insertAt, 0, ds);
      } else {
        updatedSongs.push(ds);
      }
    });
    
    setSongs(updatedSongs);
    showToast('Discovery Boost is active');
    onTrackAction(
      'Boost Activated (Revised)', 
      `Activated with "${boostIntensity.toUpperCase()}" intensity. Blended ${selectedTracks.length} tracks with smart slotting and rich contextual rationales.`
    );
  };

  const handleDeactivateBoost = () => {
    // Restores original queue instantly, proving transparency and control
    setIsBoostActive(false);
    const cleaned = songs.filter(s => s.type === 'regular');
    
    // If current playing song was a discovery song, revert back to s0
    const isCurrentDiscovered = songs.find(s => s.id === currentSongId)?.type !== 'regular';
    if (isCurrentDiscovered) {
      setCurrentSongId('s0');
      setProgress(0);
    }
    
    setSongs(cleaned);
    showToast('Discovery Boost turned off. Queue restored.');
    onTrackAction('Boost Deactivated', 'Reverted queue to original tracks. Restored total control instantly.');
  };

  // --- INLINE FEEDBACK LOOP (REVISED ONLY) ---
  const handleMoreLikeThis = (songId: string) => {
    showToast('Algorithmic weight increased for this style!');
    onTrackAction('Algorithmic Feedback', `User liked style of "${songs.find(s => s.id === songId)?.title}". Weights increased (+20%).`);
  };

  const handleLessLikeThis = (songId: string) => {
    // Replace song instantly in queue with another, proving immediate control
    const targetSong = songs.find(s => s.id === songId);
    if (!targetSong) return;
    
    showToast('Removing & replacing track with alternative style');
    
    // Find alternative from unused boost pool
    const usedIds = new Set(songs.map(s => s.id));
    const availableAlternatives = BOOST_POOL.filter(s => !usedIds.has(s.id));
    
    let updatedSongs = songs.map(s => {
      if (s.id === songId) {
        if (availableAlternatives.length > 0) {
          const alt = JSON.parse(JSON.stringify(availableAlternatives[0])) as Song;
          alt.visible = true;
          // Map seed explanation
          alt.label = `Alternative match based on your skip of ${targetSong.title}`;
          return alt;
        } else {
          // If no alternatives, just make invisible
          return { ...s, visible: false };
        }
      }
      return s;
    }).filter(s => s.visible);
    
    setSongs(updatedSongs);
    onTrackAction('Algorithmic Feedback', `User disliked "${targetSong.title}". Replaced track in real-time, decreased style weights (-35%).`);
  };

  const handleRemoveFeedbackRow = (songId: string) => {
    setDismissedFeedback(prev => {
      const next = new Set(prev);
      next.add(songId);
      return next;
    });
    onTrackAction('Feedback Row Dismissed', `User hid inline tuning console for "${songs.find(s => s.id === songId)?.title}"`);
  };

  // --- ACTIONS MENU ---
  const handleOpenOptions = (songId: string) => {
    setSelectedSongId(songId);
    setShowOptionsSheet(true);
  };

  const handlePlayNext = () => {
    if (!selectedSongId) return;
    const target = songs.find(s => s.id === selectedSongId);
    if (!target) return;
    
    const remaining = songs.filter(s => s.id !== selectedSongId);
    const curIdx = remaining.findIndex(s => s.id === currentSongId);
    
    // Insert immediately after current song
    remaining.splice(curIdx + 1, 0, target);
    setSongs(remaining);
    setShowOptionsSheet(false);
    showToast('Will play next');
    onTrackAction('Queue Rearranged', `User manually prioritized "${target.title}" to play next.`);
  };

  const handleRemoveFromQueue = () => {
    if (!selectedSongId) return;
    setSongs(prev => prev.map(s => s.id === selectedSongId ? { ...s, visible: false } : s));
    setShowOptionsSheet(false);
    showToast('Removed from queue');
    onTrackAction('Track Pruned', `User removed "${songs.find(s => s.id === selectedSongId)?.title}" from active queue.`);
  };

  // Helper formats
  const formatProgressTime = (percentage: number, durationStr: string) => {
    const parts = durationStr.split(':');
    const totalSeconds = parseInt(parts[0]) * 60 + parts[1] ? parseInt(parts[1]) : 0;
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
    const m = Math.floor(currentSeconds / 60);
    const s = currentSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center">
      
      {/* PHONE WRAPPER FRAME */}
      <div className="relative w-[375px] h-[780px] bg-spotify-black border-[10px] border-[#1f1f1f] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col font-sans select-none">
        
        {/* IPHONE STATUS BAR */}
        <div className="h-10 px-6 pt-2 flex justify-between items-center text-xs font-semibold text-white/90 z-40 bg-transparent shrink-0">
          <span className="font-mono tracking-tighter">10:09 PM</span>
          {/* Speaker pill notch */}
          <div className="w-24 h-4 bg-spotify-black rounded-full absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-center">
            <div className="w-10 h-1 bg-[#222] rounded-full"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] tracking-wide font-mono">5G</span>
            <div className="w-5 h-2.5 border border-white/60 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* NOTIFICATION FLOATING NUDGE (TRIGGER BANNER) */}
        <AnimatePresence>
          {showTriggerBanner && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-12 left-4 right-4 z-50 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div 
                onClick={handleTriggerClick}
                className="bg-gradient-to-r from-spotify-green/95 to-emerald-800/95 p-3.5 text-spotify-black flex items-center justify-between cursor-pointer active:scale-98 transition group border border-emerald-500/20 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-black/15 rounded-full flex items-center justify-center shrink-0">
                    <Sparkles className="w-4.5 h-4.5 text-black animate-pulse" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs tracking-wider uppercase opacity-75">Discovery Option Available</p>
                    <p className="font-bold text-[13px] leading-tight">Refresh your current session?</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-black text-white text-[11px] font-black rounded-full shrink-0 group-hover:bg-neutral-900 transition">
                  REFRESH
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOAST SYSTEM */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-neutral-900/95 text-white text-xs font-semibold rounded-lg shadow-lg text-center border border-white/5 whitespace-nowrap"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>



        {/* SCREEN SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative">
          
          {/* ==================== SCREEN 1: PLAYER VIEW ==================== */}
          {activeScreen === 'player' && (
            <div className="flex-1 p-6 flex flex-col justify-between">
              
              {/* Navigation Header */}
              <div className="flex justify-between items-center text-white shrink-0">
                <ChevronLeft 
                  className="w-6 h-6 text-spotify-gray hover:text-white cursor-pointer active:scale-90 transition"
                  onClick={() => showToast('Navigation back disabled in prototype')}
                />
                <span className="text-[11px] uppercase tracking-[1.5px] font-bold text-spotify-gray">NOW PLAYING</span>
                <ListMusic 
                  className={`w-6 h-6 cursor-pointer active:scale-90 transition ${activeScreen === 'queue' ? 'text-spotify-green' : 'text-spotify-gray hover:text-white'}`}
                  onClick={() => setActiveScreen('queue')}
                />
              </div>

              {/* Album Cover Art */}
              <div className="my-6 aspect-square w-full rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative group shrink-0">
                <img 
                  src={getCurrentSong().art} 
                  alt={getCurrentSong().title} 
                  className="w-full h-full object-cover transition duration-500 ease-out transform group-hover:scale-105"
                />
                
                {/* Seed rationale card overlay on cover art in Revised mode */}
                {currentFlow === 'revised' && isBoostActive && getCurrentSong().label && (
                  <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
                    <div className="w-6 h-6 bg-spotify-green/20 rounded-full flex items-center justify-center text-spotify-green shrink-0">
                      {getCurrentSong().labelIcon === 'sparkle' && <Sparkle className="w-3.5 h-3.5" />}
                      {getCurrentSong().labelIcon === 'music' && <Music className="w-3.5 h-3.5" />}
                      {getCurrentSong().labelIcon === 'fire' && <Flame className="w-3.5 h-3.5" />}
                      {getCurrentSong().labelIcon === 'compass' && <Compass className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-wider text-spotify-green font-bold">Discovery Vibe Rationale</p>
                      <p className="text-[11px] font-medium text-white/90 truncate">{getCurrentSong().label}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata Title / Artist */}
              <div className="flex justify-between items-end shrink-0">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-white truncate tracking-tight">{getCurrentSong().title}</h2>
                    {/* Tags matching flow specifications */}
                    {isBoostActive && getCurrentSong().type === 'discovered' && (
                      <span className="px-1.5 py-0.5 bg-spotify-green/10 border border-spotify-green/20 rounded text-[9px] font-bold text-spotify-green shrink-0 tracking-wider">
                        ✨ DISCOVERY
                      </span>
                    )}
                    {isBoostActive && getCurrentSong().type === 'weekend' && (
                      <span className="px-1.5 py-0.5 bg-purple-500/15 border border-purple-500/30 rounded text-[9px] font-bold text-purple-300 shrink-0 tracking-wider">
                        WEEKEND PICK
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-spotify-gray font-medium mt-1 truncate">{getCurrentSong().artist}</p>
                </div>

                <button 
                  onClick={() => handleLikeSong(currentSongId, 'Player Controls')}
                  className="text-spotify-gray hover:text-white transition active:scale-90 p-1 shrink-0"
                >
                  <Heart 
                    className={`w-6 h-6 ${likedSongs.has(currentSongId) ? 'fill-spotify-green stroke-spotify-green' : ''}`} 
                  />
                </button>
              </div>

              {/* Progress Slider Bar */}
              <div className="mt-6 shrink-0">
                <div 
                  onClick={handleSeek}
                  className="h-1 w-full bg-spotify-dark-gray/50 rounded-full cursor-pointer relative group"
                >
                  <div 
                    style={{ width: `${progress}%` }} 
                    className="h-full bg-white rounded-full group-hover:bg-spotify-green transition-all relative"
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-spotify-gray font-mono mt-2 tracking-tight">
                  <span>{formatProgressTime(progress, getCurrentSong().duration)}</span>
                  <span>{getCurrentSong().duration}</span>
                </div>
              </div>

              {/* Audio Playback Controls */}
              <div className="flex justify-between items-center my-6 shrink-0">
                <button className="text-spotify-gray hover:text-white active:scale-90 transition">
                  <Shuffle className="w-5 h-5 text-spotify-green" />
                </button>
                <button 
                  onClick={handlePrevSong}
                  className="text-white hover:text-spotify-green active:scale-90 transition"
                >
                  <SkipBack className="w-7 h-7 fill-white hover:fill-spotify-green stroke-none" />
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-white text-spotify-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-[0_0_20px_rgba(29,185,84,0.4)] hover:shadow-[0_0_30px_rgba(29,185,84,0.6)] shrink-0"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-black stroke-none" /> : <Play className="w-6 h-6 fill-black stroke-none translate-x-0.5" />}
                </button>
                <button 
                  onClick={handleNextSong}
                  className="text-white hover:text-spotify-green active:scale-90 transition"
                >
                  <SkipForward className="w-7 h-7 fill-white hover:fill-spotify-green stroke-none" />
                </button>
                <button className="text-spotify-gray hover:text-white active:scale-90 transition">
                  <Repeat className="w-5 h-5" />
                </button>
              </div>

              {/* Discovery Boost Interactive Toolbar Bottom Action */}
              <div className="p-3.5 bg-spotify-surface/40 border border-white/5 rounded-2xl flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${isBoostActive ? 'bg-spotify-green text-spotify-black font-bold' : 'bg-white/10 text-spotify-gray'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-none">Discovery Boost</p>
                    <p className="text-[9.5px] text-spotify-gray mt-1 leading-none">
                      {isBoostActive ? 'Personalized blend active' : 'Turn on to blend session'}
                    </p>
                  </div>
                </div>

                {isBoostActive ? (
                  <button 
                    onClick={handleDeactivateBoost}
                    className="px-2.5 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-bold hover:bg-white/15 active:scale-95 transition"
                  >
                    DISABLE
                  </button>
                ) : (
                  <button 
                    onClick={handleTriggerClick}
                    className="px-3 py-1.5 bg-spotify-green text-spotify-black rounded-full text-[10px] font-black hover:bg-spotify-green-hover active:scale-95 transition shadow-lg shrink-0"
                  >
                    REFRESH MUSIC
                  </button>
                )}
              </div>

            </div>
          )}

          {/* ==================== SCREEN 2: QUEUE VIEW ==================== */}
          {activeScreen === 'queue' && (
            <div className="flex-1 p-5 flex flex-col">
              
              {/* Queue Header */}
              <div className="flex justify-between items-center text-white mb-4 shrink-0">
                <div className="flex items-center gap-2" onClick={() => setActiveScreen('player')}>
                  <ChevronLeft className="w-5 h-5 text-spotify-gray hover:text-white cursor-pointer" />
                  <h1 className="text-lg font-bold tracking-tight">Play Queue</h1>
                </div>

                {/* Queue context control: clear button ONLY in revised flow */}
                {currentFlow === 'revised' && isBoostActive && (
                  <button 
                    onClick={handleDeactivateBoost}
                    className="flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/20 active:scale-95 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    REVERT BOOST
                  </button>
                )}
              </div>

              {/* ACTIVE SONGS IN QUEUE */}
              <div className="flex-1 space-y-5">
                
                {/* Section: Now Playing */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-spotify-gray font-black mb-2.5">Now Playing</h3>
                  <div className="bg-spotify-surface/40 p-2 rounded-xl border border-white/5">
                    {songs.filter(s => s.visible && s.id === currentSongId).map(song => (
                      <div key={song.id} className="flex items-center gap-3">
                        <img src={song.art} alt={song.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-spotify-green truncate">{song.title}</p>
                          <p className="text-xs text-spotify-gray truncate">{song.artist}</p>
                        </div>
                        <Volume2 className="w-4.5 h-4.5 text-spotify-green shrink-0 mr-1" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Next In Queue */}
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-wider text-spotify-gray font-black mb-2.5">Next Up</h3>
                  <div className="space-y-1">
                    {songs.filter(s => s.visible && s.id !== currentSongId).map((song, sIdx) => {
                      const isDiscovered = song.type === 'discovered';
                      const isWeekend = song.type === 'weekend';
                      
                      return (
                        <div 
                          key={song.id} 
                          className={`group p-2.5 rounded-xl transition flex flex-col gap-2 ${
                            (isDiscovered || isWeekend)
                              ? 'bg-gradient-to-r from-spotify-green/5 to-emerald-950/10 border border-spotify-green/40 shadow-[0_0_15px_rgba(29,185,84,0.15)] animate-[pulse_3s_infinite]'
                              : 'hover:bg-white/5 bg-transparent border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Small Album Art */}
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                              <img src={song.art} alt={song.title} className="w-full h-full object-cover" />
                              {(isDiscovered || isWeekend) && (
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                  <Sparkles className="w-3.5 h-3.5 text-spotify-green" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-white truncate">{song.title}</p>
                                {isDiscovered && (
                                  <span className="px-1.5 py-0.5 bg-spotify-green text-spotify-black text-[8px] font-black rounded uppercase tracking-wider">
                                    MATCH
                                  </span>
                                )}
                                {isWeekend && (
                                  <span className="px-1.5 py-0.5 bg-purple-500 text-white text-[8px] font-black rounded uppercase tracking-wider">
                                    WEEKEND
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-spotify-gray truncate mt-0.5">{song.artist}</p>
                              
                              {/* Contextual Recommendation Rationale below title */}
                              {currentFlow === 'revised' && song.label && (
                                <p className="text-[9.5px] text-spotify-green/80 flex items-center gap-1 mt-1 font-medium">
                                  <Sparkles className="w-2.5 h-2.5 shrink-0" />
                                  {song.label}
                                </p>
                              )}
                            </div>

                            {/* Menu dots */}
                            <button 
                              onClick={() => handleOpenOptions(song.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-spotify-gray hover:text-white transition"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>

                          {/* INLINE TUNING CONSOLE - ONLY FOR PLAYED/UPCOMING DISCOVERED SONGS IN REVISED FLOW */}
                          {currentFlow === 'revised' && (isDiscovered || isWeekend) && !dismissedFeedback.has(song.id) && (
                            <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/5 text-[10px]">
                              <button 
                                onClick={() => handleLikeSong(song.id, 'Queue Feedback')}
                                className={`px-2.5 py-1 rounded-full border flex items-center gap-1 transition ${
                                  likedSongs.has(song.id)
                                    ? 'bg-spotify-green/10 border-spotify-green/30 text-spotify-green font-bold'
                                    : 'border-white/10 text-spotify-gray hover:text-white hover:border-white/30'
                                }`}
                              >
                                <Heart className={`w-3 h-3 ${likedSongs.has(song.id) ? 'fill-spotify-green' : ''}`} />
                                {likedSongs.has(song.id) ? 'Saved' : 'Save'}
                              </button>
                              <button 
                                onClick={() => handleMoreLikeThis(song.id)}
                                className="px-2.5 py-1 rounded-full border border-white/10 text-spotify-gray hover:text-white hover:border-white/30 flex items-center gap-1 transition"
                              >
                                <Compass className="w-3 h-3 text-emerald-400" />
                                More Like This
                              </button>
                              <button 
                                onClick={() => handleLessLikeThis(song.id)}
                                className="px-2.5 py-1 rounded-full border border-white/10 text-spotify-gray hover:text-white hover:border-white/30 flex items-center gap-1 transition"
                              >
                                <SkipForward className="w-3 h-3 text-amber-500" />
                                Skip Style
                              </button>
                              <button 
                                onClick={() => handleRemoveFeedbackRow(song.id)}
                                className="w-5 h-5 ml-auto flex items-center justify-center text-spotify-dark-gray hover:text-spotify-gray transition"
                                title="Dismiss options row"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Return to player */}
              <button 
                onClick={() => setActiveScreen('player')}
                className="w-full mt-4 py-3 bg-spotify-surface border border-white/5 rounded-full text-xs font-bold text-white hover:bg-spotify-hover active:scale-98 transition shrink-0"
              >
                CLOSE QUEUE
              </button>

            </div>
          )}

        </div>

        {/* ==================== INTERACTIVE OVERLAYS & SHEETS ==================== */}



        {/* 2. REVISED SLEEK ONBOARDING BOTTOM SHEET */}
        <AnimatePresence>
          {showOnboarding && (
            <div className="absolute inset-0 bg-black/70 z-50 flex items-end justify-center">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full bg-gradient-to-b from-[#1a251e] to-spotify-black rounded-t-[40px] p-6 border-t border-emerald-500/20"
              >
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5"></div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-spotify-green text-spotify-black rounded-full flex items-center justify-center">
                    <Sparkles className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-md font-extrabold text-white">Discovery Refresh</h3>
                    <p className="text-xs text-spotify-gray mt-0.5">Custom-blending new matching tracks into your queue</p>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-5 space-y-4">
                  {/* Slider Control for Intensity */}
                  <div className="py-2">
                    <p className="text-[10px] uppercase font-black tracking-widest text-spotify-gray text-center mb-4">
                      Intensity selector
                    </p>
                    
                    <div className="relative px-6 my-4">
                      {/* Slider Track Line */}
                      <div className="absolute h-1 bg-white/10 left-12 right-12 top-[18px] rounded-full">
                        {/* Green progress line */}
                        <div 
                          className="h-full bg-spotify-green rounded-full transition-all duration-300"
                          style={{ 
                            width: boostIntensity === 'subtle' ? '0%' : boostIntensity === 'balanced' ? '50%' : '100%' 
                          }}
                        />
                      </div>

                      {/* Slider Options */}
                      <div className="flex justify-between items-center relative z-10">
                        {/* Option 1: Subtle */}
                        <button 
                          onClick={() => setBoostIntensity('subtle')}
                          className="flex flex-col items-center group focus:outline-none cursor-pointer"
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            boostIntensity === 'subtle' 
                              ? 'bg-spotify-green text-spotify-black scale-110 shadow-[0_0_12px_rgba(29,185,84,0.4)] font-bold' 
                              : 'bg-[#181818] text-spotify-gray group-hover:text-white'
                          }`}>
                            <Leaf className="w-4.5 h-4.5" />
                          </div>
                          {/* Node circle on the slider track */}
                          <div className={`w-3 h-3 rounded-full border-2 border-black mt-2.5 transition-all ${
                            boostIntensity === 'subtle' ? 'bg-spotify-green' : 'bg-spotify-dark-gray'
                          }`} />
                          <span className={`text-[10px] font-bold mt-2 transition-colors ${
                            boostIntensity === 'subtle' ? 'text-spotify-green' : 'text-spotify-gray'
                          }`}>
                            Subtle
                          </span>
                        </button>

                        {/* Option 2: Balanced */}
                        <button 
                          onClick={() => setBoostIntensity('balanced')}
                          className="flex flex-col items-center group focus:outline-none cursor-pointer"
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            boostIntensity === 'balanced' 
                              ? 'bg-spotify-green text-spotify-black scale-110 shadow-[0_0_12px_rgba(29,185,84,0.4)] font-bold' 
                              : 'bg-[#181818] text-spotify-gray group-hover:text-white'
                          }`}>
                            <Waves className="w-4.5 h-4.5" />
                          </div>
                          {/* Node circle on the slider track */}
                          <div className={`w-3 h-3 rounded-full border-2 border-black mt-2.5 transition-all ${
                            boostIntensity === 'balanced' ? 'bg-spotify-green' : 'bg-spotify-dark-gray'
                          }`} />
                          <span className={`text-[10px] font-bold mt-2 transition-colors ${
                            boostIntensity === 'balanced' ? 'text-spotify-green' : 'text-spotify-gray'
                          }`}>
                            Balanced
                          </span>
                        </button>

                        {/* Option 3: Adventurous */}
                        <button 
                          onClick={() => setBoostIntensity('adventurous')}
                          className="flex flex-col items-center group focus:outline-none cursor-pointer"
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            boostIntensity === 'adventurous' 
                              ? 'bg-spotify-green text-spotify-black scale-110 shadow-[0_0_12px_rgba(29,185,84,0.4)] font-bold' 
                              : 'bg-[#181818] text-spotify-gray group-hover:text-white'
                          }`}>
                            <Shuffle className="w-4.5 h-4.5" />
                          </div>
                          {/* Node circle on the slider track */}
                          <div className={`w-3 h-3 rounded-full border-2 border-black mt-2.5 transition-all ${
                            boostIntensity === 'adventurous' ? 'bg-spotify-green' : 'bg-spotify-dark-gray'
                          }`} />
                          <span className={`text-[10px] font-bold mt-2 transition-colors ${
                            boostIntensity === 'adventurous' ? 'text-spotify-green' : 'text-spotify-gray'
                          }`}>
                            Adventurous
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-spotify-gray pt-1 border-t border-white/5">
                    <Shield className="w-4 h-4 text-spotify-green shrink-0 mt-0.5" />
                    <p className="leading-normal">
                      <strong>You are in control.</strong> Every boosted song comes with instant "More Like" and "Less Like" options to guide the model. Revert anytime with one tap.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowOnboarding(false)}
                    className="flex-1 py-3.5 bg-transparent border border-white/10 text-white rounded-full font-black hover:bg-white/5 active:scale-95 transition text-xs tracking-wider"
                  >
                    KEEP CURRENT VIBE
                  </button>
                  <button 
                    onClick={handleActivateRevisedBoost}
                    className="flex-1 py-3.5 bg-spotify-green text-spotify-black rounded-full font-black hover:bg-spotify-green-hover active:scale-95 transition text-xs tracking-wider"
                  >
                    BOOST SESSION
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 3. CONTEXT MENU BOTTOM SHEET (OPTIONS) */}
        <AnimatePresence>
          {showOptionsSheet && selectedSongId && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full bg-[#1c1c1c] rounded-t-[32px] p-5 text-white border-t border-white/10"
              >
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>
                
                {/* Selected Song Preview */}
                <div className="flex items-center gap-3 pb-3.5 border-b border-white/10 mb-3.5">
                  <img 
                    src={songs.find(s => s.id === selectedSongId)?.art} 
                    alt="art" 
                    className="w-11 h-11 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold truncate">{songs.find(s => s.id === selectedSongId)?.title}</p>
                    <p className="text-xs text-spotify-gray truncate">{songs.find(s => s.id === selectedSongId)?.artist}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <button 
                    onClick={handlePlayNext}
                    className="w-full text-left py-3 px-2 rounded-lg hover:bg-white/5 transition text-sm flex items-center gap-3 font-semibold"
                  >
                    <SkipForward className="w-4 h-4 text-spotify-gray" />
                    Play Next
                  </button>
                  <button 
                    onClick={handleRemoveFromQueue}
                    className="w-full text-left py-3 px-2 rounded-lg hover:bg-red-500/10 text-red-400 transition text-sm flex items-center gap-3 font-semibold"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    Remove from Queue
                  </button>
                  
                  {currentFlow === 'revised' && songs.find(s => s.id === selectedSongId)?.type !== 'regular' && (
                    <>
                      <button 
                        onClick={() => {
                          setShowOptionsSheet(false);
                          setShowWhySheet(true);
                          onTrackAction('Open Rationale', 'Opening detailed "Why recommended" information card.');
                        }}
                        className="w-full text-left py-3 px-2 rounded-lg hover:bg-white/5 transition text-sm flex items-center gap-3 font-semibold text-spotify-green"
                      >
                        <HelpCircle className="w-4 h-4 text-spotify-green" />
                        Why was this recommended?
                      </button>
                      <button 
                        onClick={() => {
                          handleMoreLikeThis(selectedSongId);
                          setShowOptionsSheet(false);
                        }}
                        className="w-full text-left py-3 px-2 rounded-lg hover:bg-white/5 transition text-sm flex items-center gap-3 font-semibold"
                      >
                        <Compass className="w-4 h-4 text-spotify-gray" />
                        More like this style
                      </button>
                    </>
                  )}

                  <button 
                    onClick={() => {
                      setShowOptionsSheet(false);
                      setShowPlaylistSheet(true);
                    }}
                    className="w-full text-left py-3 px-2 rounded-lg hover:bg-white/5 transition text-sm flex items-center gap-3 font-semibold"
                  >
                    <Plus className="w-4 h-4 text-spotify-gray" />
                    Add to playlist
                  </button>
                </div>

                <button 
                  onClick={() => setShowOptionsSheet(false)}
                  className="w-full mt-4 py-3 bg-white/5 rounded-full text-xs font-bold hover:bg-white/10 transition"
                >
                  CANCEL
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 4. WHY RECOMMENDED EXPLANATION CARD */}
        <AnimatePresence>
          {showWhySheet && selectedSongId && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full bg-gradient-to-b from-neutral-900 to-spotify-black rounded-t-[32px] p-6 border-t border-white/10"
              >
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5"></div>
                
                <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center text-spotify-green mx-auto mb-4">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                
                <h3 className="text-md font-black text-center text-white mb-2">Discovery Rationale</h3>
                
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center mb-6">
                  <p className="text-xs text-spotify-gray mb-1">RECOMMENDED TRACK</p>
                  <p className="text-sm font-bold text-white mb-3">
                    "{songs.find(s => s.id === selectedSongId)?.title}" by {songs.find(s => s.id === selectedSongId)?.artist}
                  </p>
                  
                  <div className="p-3 bg-black/40 rounded-xl inline-block border border-spotify-green/10 text-xs text-spotify-green font-bold">
                    {songs.find(s => s.id === selectedSongId)?.label || 'Aesthetic match with current queue seeds'}
                  </div>
                </div>

                <p className="text-xs text-spotify-gray text-center leading-normal mb-6">
                  Discovery Boost analyzed your repetitiveness metrics over the past 14 days and matched this track's acoustic profile (tempo, energy, timbre) to your exact comfort zone, avoiding overexposed songs you've skipped recently.
                </p>

                <button 
                  onClick={() => setShowWhySheet(false)}
                  className="w-full py-4 bg-spotify-green text-spotify-black rounded-full text-xs font-black hover:scale-102 active:scale-98 transition tracking-wider"
                >
                  GOT IT
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 5. ADD TO PLAYLIST SHEET */}
        <AnimatePresence>
          {showPlaylistSheet && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full bg-[#1c1c1c] rounded-t-[32px] p-6 text-white border-t border-white/10 max-h-[70%] overflow-y-auto"
              >
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5"></div>
                <h3 className="text-md font-extrabold mb-4">Select Playlist</h3>
                
                <div className="space-y-1.5">
                  {['Late Night Drive', 'Synthwave Oasis', 'My Liked Songs', 'Chill Lounge', 'Daily Mix 1'].map((playlist, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setShowPlaylistSheet(false);
                        showToast(`Added to "${playlist}"`);
                        onTrackAction('Playlist Add', `Track saved into user playlist "${playlist}"`);
                      }}
                      className="w-full text-left py-3.5 px-3 rounded-xl hover:bg-white/5 transition text-xs font-bold border border-white/5"
                    >
                      🎵 {playlist}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setShowPlaylistSheet(false)}
                  className="w-full mt-4 py-3 bg-white/5 rounded-full text-xs font-bold hover:bg-white/10 transition"
                >
                  CANCEL
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 6. REVISED PREMIUM SUCCESS OVERLAY (HEART POP) */}
        <AnimatePresence>
          {showSuccessOverlay && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Animated flying particles */}
              <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-20 h-20 bg-spotify-green/10 rounded-full flex items-center justify-center text-spotify-green"
                >
                  <Heart className="w-12 h-12 fill-spotify-green text-spotify-green" />
                </motion.div>
                
                {/* Custom simulated float particle elements */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i * 60 * Math.PI) / 180;
                  const x = Math.cos(angle) * 45;
                  const y = Math.sin(angle) * 45;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, x: x * 1.3, y: y * 1.3, scale: 0 }}
                      transition={{ delay: 0.15, duration: 0.8, ease: 'easeOut' }}
                      className="absolute w-2.5 h-2.5 bg-spotify-green rounded-full"
                    />
                  );
                })}
              </div>

              <h2 className="text-xl font-black text-white leading-tight">Liked Songs Spark!</h2>
              <p className="text-xs text-spotify-gray mt-2 leading-relaxed px-4">
                <strong>Discovery Boost</strong> successfully matched your taste. This feedback instantly tunes your current session parameters.
              </p>

              <div className="mt-8 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl max-w-xs flex items-center gap-2.5">
                <Zap className="w-4.5 h-4.5 text-spotify-green shrink-0" />
                <span className="text-[10px] text-spotify-green tracking-wider uppercase font-black text-left">
                  personalization weights updated +25%
                </span>
              </div>

              <button 
                onClick={() => setShowSuccessOverlay(false)}
                className="mt-10 px-8 py-3.5 bg-white text-spotify-black rounded-full text-xs font-black tracking-widest hover:scale-105 active:scale-95 transition"
              >
                CONTINUE LISTENING
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
