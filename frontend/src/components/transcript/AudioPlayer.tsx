'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { formatDuration } from '@/lib/utils';

interface AudioPlayerProps {
  meetingTitle: string;
  duration: number;
  currentTime?: number;
  onSeek?: (time: number) => void;
  onTimeUpdate?: (time: number) => void;
}

// Sample public-domain audio for demonstration
const SAMPLE_AUDIO_URL = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3';

export function AudioPlayer({ meetingTitle, duration, currentTime = 0, onSeek, onTimeUpdate }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localTime, setLocalTime] = useState(currentTime);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const animRef = useRef<number>(0);

  // Simulate playback (since we don't have a real audio file per meeting)
  useEffect(() => {
    if (isPlaying) {
      const start = performance.now();
      const startTime = localTime;
      const tick = (now: number) => {
        const elapsed = (now - start) / 1000 * speed;
        const next = Math.min(startTime + elapsed, duration);
        setLocalTime(next);
        onTimeUpdate?.(next);
        if (next < duration) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          setIsPlaying(false);
        }
      };
      animRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, duration, speed]); // eslint-disable-line

  // Sync external currentTime (from transcript click)
  useEffect(() => {
    setLocalTime(currentTime);
  }, [currentTime]);

  const handleSeekClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarRef.current) return;
    const rect = seekBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    setLocalTime(newTime);
    onSeek?.(newTime);
  }, [duration, onSeek]);

  const skip = (secs: number) => {
    const newTime = Math.max(0, Math.min(duration, localTime + secs));
    setLocalTime(newTime);
    onSeek?.(newTime);
  };

  const progress = duration > 0 ? (localTime / duration) * 100 : 0;

  // Waveform bars (decorative)
  const bars = Array.from({ length: 40 }, (_, i) => {
    const height = Math.random() * 16 + 4;
    return height;
  });

  return (
    <div className="player-bar" role="region" aria-label="Audio player">
      {/* Waveform */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 32, marginBottom: 2 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            className={`waveform-bar ${i / bars.length < progress / 100 ? 'active' : ''}`}
            style={{
              height: `${h}px`,
              animationDelay: `${i * 0.03}s`,
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          />
        ))}
      </div>

      {/* Seek bar */}
      <div className="player-seek-container">
        <span className="player-time-display">{formatDuration(localTime)}</span>
        <div
          ref={seekBarRef}
          className="player-seek"
          onClick={handleSeekClick}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={Math.round(localTime)}
          aria-valuetext={formatDuration(localTime)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') skip(5);
            if (e.key === 'ArrowLeft') skip(-5);
          }}
        >
          <div className="player-seek-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="player-time-display">{formatDuration(duration)}</span>
      </div>

      {/* Controls */}
      <div className="player-controls">
        {/* Rewind 10s */}
        <button className="player-btn" onClick={() => skip(-10)} title="Rewind 10s" aria-label="Rewind 10 seconds">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2.5A5.5 5.5 0 1 0 13.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 2.5L5.5 5M8 2.5L10.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="5.5" y="10" fill="currentColor" fontSize="5" fontWeight="bold">10</text>
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          className="player-btn play-btn"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          id="audio-play-pause"
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="4" y="3" width="3" height="10" rx="1"/>
              <rect x="9" y="3" width="3" height="10" rx="1"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 3.5L13 8L5 12.5V3.5Z"/>
            </svg>
          )}
        </button>

        {/* Forward 10s */}
        <button className="player-btn" onClick={() => skip(10)} title="Forward 10s" aria-label="Forward 10 seconds">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2.5A5.5 5.5 0 1 1 2.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 2.5L10.5 5M8 2.5L5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="5.5" y="10" fill="currentColor" fontSize="5" fontWeight="bold">10</text>
          </svg>
        </button>

        {/* Info */}
        <div className="player-info">
          <div className="player-title">{meetingTitle}</div>
          <div className="player-time">
            {isPlaying ? '● Playing' : 'Paused'} · {speed}x
          </div>
        </div>

        {/* Speed */}
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            border: 'none',
            borderRadius: 6,
            padding: '4px 6px',
            fontSize: 12,
            cursor: 'pointer',
          }}
          aria-label="Playback speed"
        >
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
            <option key={s} value={s} style={{ background: '#1A1726' }}>{s}x</option>
          ))}
        </select>

        {/* Volume toggle */}
        <button
          className="player-btn"
          onClick={() => setIsMuted((m) => !m)}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6H2v4h2l4 3V3L4 6z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
              <path d="M12 6l-3 3M9 6l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6H2v4h2l4 3V3L4 6z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
              <path d="M11 5.5a3 3 0 0 1 0 5M9.5 7a1.5 1.5 0 0 1 0 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
