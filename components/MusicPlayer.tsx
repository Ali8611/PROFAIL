'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Repeat, Music, ChevronDown, ChevronUp } from 'lucide-react';

interface MusicPlayerProps {
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string | null;
  autoplay?: boolean;
  loop?: boolean;
  accentColor?: string;
}

export default function MusicPlayer({
  title,
  artist,
  audioUrl,
  coverUrl,
  autoplay = false,
  loop = true,
  accentColor = '#00f0ff',
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(loop);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (!isLooping) setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    if (autoplay) {
      // Browser autoplay policy: attempt to play; handle failure gracefully
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [autoplay, isLooping]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Audio play prevented:', err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
    setIsLooping(!isLooping);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!audioUrl) return null;

  return (
    <div className="w-full transition-all duration-300">
      <audio ref={audioRef} src={audioUrl} loop={isLooping} preload="metadata" />

      <div
        className="backdrop-blur-xl rounded-2xl border border-white/10 p-3.5 shadow-glass relative overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(15, 15, 25, 0.75)',
        }}
      >
        {/* Glow accent */}
        <div
          className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ background: accentColor }}
        />

        <div className="flex items-center justify-between gap-3">
          {/* Cover & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 relative group">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isPlaying ? 'scale-105 rotate-2' : ''
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <Music className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: accentColor }} />
                <h4 className="text-xs font-bold text-white truncate">{title}</h4>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">{artist}</p>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold transition-transform hover:scale-105 shadow-md"
              style={{ background: accentColor }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
            </button>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title={isMinimized ? 'Expand controls' : 'Collapse controls'}
            >
              {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Extended controls (Collapsible) */}
        {!isMinimized && (
          <div className="mt-3 pt-2.5 border-t border-white/5 space-y-2">
            {/* Progress bar */}
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <span>{formatTime(duration)}</span>
            </div>

            {/* Bottom utility: loop & volume */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <button
                onClick={toggleLoop}
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors ${
                  isLooping ? 'text-cyan-400 bg-cyan-400/10' : 'hover:text-white'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Loop</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button onClick={toggleMute} className="hover:text-white transition-colors">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
