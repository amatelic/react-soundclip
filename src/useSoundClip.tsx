import { useState, useEffect, useRef, useCallback } from "react";
import { Howl, HowlOptions } from "howler";

export interface Sound {
  sound: Howl | null;
  isPlaying: boolean;
  play: (soundId?: number | null) => void;
  pause: (soundId?: number | null) => void;
  stop: (soundId?: number | null) => void;
  volume: number;
  muted: boolean;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

export const useSoundClip = (
  src: string | string[],
  options: HowlOptions = {},
): Sound => {
  const [sound, setSound] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [muted, setMuted] = useState<boolean>(false);
  const howlRef = useRef<Howl | null>(null);

  // Initialize Howl instance
  useEffect(() => {
    console.log("Initializing sound clip");
    if (!src) return;

    const howl = new Howl({
      src: Array.isArray(src) ? src : [src],
      html5: true,
      ...options,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
      onloaderror: () => console.error("Error loading sound"),
      onplayerror: () => console.error("Error playing sound"),
    });

    howlRef.current = howl;
    setSound(howl);

    return () => {
      howl.unload();
    };
  }, [src]);

  const play = useCallback((soundId: number | null = null) => {
    howlRef.current?.play();
  }, []);

  const pause = useCallback((soundId: number | null = null) => {
    howlRef.current?.pause();
  }, []);

  const stop = useCallback((soundId: number | null = null) => {
    howlRef.current?.stop();
  }, []);

  const toggleMute = useCallback(() => {
    if (!howlRef.current) return;
    const newMuted = !muted;
    howlRef.current.mute(newMuted);
    setMuted(newMuted);
  }, [muted]);

  const setHowlVolume = useCallback((newVolume: number) => {
    if (!howlRef.current) return;
    howlRef.current.volume(newVolume);
    setVolume(newVolume);
  }, []);

  return {
    sound,
    isPlaying,
    play,
    pause,
    stop,
    volume,
    muted,
    toggleMute,
    setVolume: setHowlVolume,
  };
};

export default useSoundClip;
