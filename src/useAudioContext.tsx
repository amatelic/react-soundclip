import {
  createContext,
  useContext,
  useState,
  useRef,
  type PropsWithChildren,
} from "react";
import { AudioContextProps } from "./types";
import { cleanKey } from "./utils/utils";
import { Howl } from "howler";

interface AudioChildrenContext {
  hasPlayed: boolean;
  initial: string | boolean | undefined;
  exits: string | boolean | undefined;
  src: string;
  volume: number;
}

// Define the shape of the context value
interface AudioContextValue {
  volume: number;
  setVolume: (value: number) => void;
  getAudio: (key: string) => HTMLAudioElement | undefined;
  getConfig: (key: string) => AudioChildrenContext | undefined;
  removeAudio: (key: string) => void;
  setAudio: (key: string, audio: AudioChildrenContext) => void;
  listAudioKeys(): string[];
}

// Create context with a default value that will never be used (since you throw if undefined)
const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export const AudioProvider = ({
  children,
  defaults = { volume: 1, autoPlay: false },
}: PropsWithChildren<{ defaults?: AudioContextProps }>) => {
  const [volume, setVolume] = useState(defaults.volume);
  const audioRef = useRef<Record<string, AudioChildrenContext>>({});

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const getAudio = (key: string): ReturnType<Howl> | undefined => {
    const config = audioRef.current[cleanKey(key)];

    if (!config) {
      return;
    }

    let sounds = [];

    if (config.src) {
      sounds.push(config.src);
    }

    if (config.initial) {
      sounds.push(config.initial && config.src);
    }

    if (config.exits) {
      sounds.push(config.exits && config.src);
    }

    return new Howl({
      src: sounds,
      volume: config.volume,
    });
  };

  const getConfig = (key: string): ReturnType<Howl> => {
    return audioRef.current[cleanKey(key)];
  };

  const setAudio = (
    key: string,
    audioConfig: Parameters<AudioContextValue["setAudio"]>[1],
  ) => {
    if (audioRef.current[cleanKey(key)]) {
      return;
    }
    audioRef.current[cleanKey(key)] = audioConfig;
    // in case there is an init play the audio
    if (audioConfig.initial && !audioConfig.hasPlayed) {
      const sound = new Howl({
        src: audioConfig.initial,
        volume: audioConfig.volume,
        onend: function () {
          console.log("Finished!");
          audioConfig.hasPlayed = true;
        },
      });
      sound.play();
    }
  };

  const removeAudio = (key: string) => {
    delete audioRef.current[cleanKey(key)];
  };

  const listAudioKeys = () => {
    return Object.keys(audioRef.current);
  };

  return (
    <AudioContext.Provider
      value={{
        volume,
        setVolume: handleVolumeChange,
        getAudio,
        setAudio,
        removeAudio,
        listAudioKeys,
        getConfig,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
