import { useEffect, useRef, useState } from "react";

export function useAudioEngine(settings) {
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume;
    }
  }, [settings.volume]);

  useEffect(() => {
    if (settings.sleepTimer > 0 && isPlaying) {
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
      }, settings.sleepTimer * 60 * 1000);
    }

    return () => clearTimeout(timerRef.current);
  }, [settings.sleepTimer, isPlaying]);

  const handleToggleSound = (sound) => {
    if (!sound || !audioRef.current) return;

    if (currentSound?.id === sound.id) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.pause();
      audioRef.current.src = sound.url;
      audioRef.current.loop = true;
      audioRef.current.volume = settings.volume;
      audioRef.current.play();

      setCurrentSound(sound);
      setIsPlaying(true);
    }
  };

  return { currentSound, isPlaying, handleToggleSound };
}