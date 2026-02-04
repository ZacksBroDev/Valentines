import { useState, useCallback, useRef, useEffect } from "react";
import { isSoundMuted, setSoundMuted } from "../utils/storage";

// Simple sound effects using Web Audio API
const createAudioContext = () => {
  if (typeof window !== "undefined" && window.AudioContext) {
    return new AudioContext();
  }
  return null;
};

interface UseSoundReturn {
  isMuted: boolean;
  toggleMute: () => void;
  playPop: () => void;
  playChime: () => void;
}

export const useSound = (): UseSoundReturn => {
  const [isMuted, setIsMuted] = useState(() => isSoundMuted());
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const handleInteraction = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = createAudioContext();
      }
      // Remove listener after first interaction
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setSoundMuted(newMuted);
  }, [isMuted]);

  const playPop = useCallback(() => {
    if (isMuted || !audioContextRef.current) return;

    try {
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(600, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        200,
        ctx.currentTime + 0.1,
      );

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch {
      // Silently fail
    }
  }, [isMuted]);

  const playChime = useCallback(() => {
    if (isMuted || !audioContextRef.current) return;

    try {
      const ctx = audioContextRef.current;

      // Play a pleasant two-note chime
      const playNote = (freq: number, startTime: number, duration: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(freq, startTime);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playNote(523.25, now, 0.3); // C5
      playNote(659.25, now + 0.1, 0.4); // E5
    } catch {
      // Silently fail
    }
  }, [isMuted]);

  return {
    isMuted,
    toggleMute,
    playPop,
    playChime,
  };
};
