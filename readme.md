# React Soundclip

[![npm version](https://badge.fury.io/js/react-soundclip.svg)](https://badge.fury.io/js/react-soundclip)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React library for effortless audio integration with declarative API support. Built on [Howler.js](https://howlerjs.com/) for cross-browser compatibility.

## Features

- **Hook-based API** - `useSoundClip` for direct audio control
- **Declarative audio** - Attach sounds to components with data attributes
- **Mount/unmount sounds** - Play audio when elements appear or disappear
- **Global audio controls** - Mute/unmute all audio with a single toggle
- **TypeScript support** - Full type definitions included
- **Volume control** - Per-element and global volume management
- **Built on Howler.js** - Robust, battle-tested audio engine

## Installation

```bash
npm install react-soundclip
# or
yarn add react-soundclip
# or
pnpm add react-soundclip
```

## Quick Start

```tsx
import { AudioProvider, useSoundClip } from 'react-soundclip';

function App() {
  return (
    <AudioProvider>
      <SoundButton />
    </AudioProvider>
  );
}

function SoundButton() {
  const { play, isPlaying } = useSoundClip('/ding.mp3');
  
  return (
    <button onClick={play} disabled={isPlaying}>
      Play Sound
    </button>
  );
}
```

## API

### `useSoundClip(src, options?)`

Hook for direct audio control.

**Parameters:**
- `src` (string | string[]): Audio file URL(s)
- `options` (HowlOptions): Howler.js configuration options

**Returns:**
```tsx
{
  sound: Howl | null;      // Howler instance
  isPlaying: boolean;      // Current playback state
  play: () => void;        // Start playback
  pause: () => void;       // Pause playback
  stop: () => void;        // Stop playback
  volume: number;          // Current volume (0-1)
  muted: boolean;          // Mute state
  toggleMute: () => void;  // Toggle mute
  setVolume: (v: number) => void;  // Set volume
}
```

### `AudioProvider` & `useAudioContext()`

Context provider for global audio state management.

```tsx
import { AudioProvider, useAudioContext } from 'react-soundclip';

function App() {
  return (
    <AudioProvider defaults={{ volume: 0.8, autoPlay: false }}>
      <YourApp />
    </AudioProvider>
  );
}

function MuteButton() {
  const { isMute, toggleMute } = useAudioContext();
  
  return (
    <button onClick={toggleMute}>
      {isMute ? 'Unmute' : 'Mute'} All
    </button>
  );
}
```

**useAudioContext returns:**
```tsx
{
  toggleMute: () => void;                    // Toggle global mute
  getAudio: (key: string) => HTMLAudioElement | undefined;
  getConfig: (key: string) => AudioChildrenContext | undefined;
  removeAudio: (key: string) => void;        // Remove audio by key
  setAudio: (key: string, audio) => void;    // Register audio
  listAudioKeys: () => string[];             // List all registered keys
  isMute: boolean;                           // Global mute state
}
```

### `AudioPresent`

Declarative wrapper for mount/unmount sounds using data attributes.

```tsx
import { AudioPresent } from 'react-soundclip';

<AudioPresent src="/default.mp3">
  <button 
    data-key="my-button"
    data-src="/ding.mp3"
    data-initial="/ding.mp3"     // Play on mount
    data-exit="/jump.mp3"        // Play on unmount
    data-volume={0.5}            // Volume (0-1)
  >
    Click me!
  </button>
</AudioPresent>
```

**Data Attributes:**
- `data-key` (required): Unique identifier
- `data-src`: Default audio source
- `data-initial`: Audio to play on component mount
- `data-exit`: Audio to play on component unmount
- `data-volume`: Volume level (0-1), defaults to 1

## Examples

### Direct Control with Hook

```tsx
function AudioPlayer() {
  const { play, pause, stop, isPlaying, volume, setVolume } = 
    useSoundClip('/music.mp3', { loop: true });

  return (
    <div>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={stop}>Stop</button>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </div>
  );
}
```

### Dynamic List with Mount/Unmount Sounds

```tsx
function TodoList() {
  const [items, setItems] = useState<string[]>([]);

  return (
    <AudioPresent src="/ding.mp3">
      <button onClick={() => setItems([...items, `Item ${items.length}`])}>
        Add Item
      </button>
      
      {items.map((item, index) => (
        <div 
          key={index}
          data-key={`item-${index}`}
          data-initial="/add.mp3"
          data-exit="/remove.mp3"
        >
          {item}
          <button onClick={() => setItems(items.filter((_, i) => i !== index))}>
            Remove
          </button>
        </div>
      ))}
    </AudioPresent>
  );
}
```

### Global Mute Toggle

```tsx
function Header() {
  const { toggleMute, isMute } = useAudioContext();
  
  return (
    <header>
      <button onClick={toggleMute}>
        {isMute ? '🔇 Unmute All' : '🔊 Mute All'}
      </button>
    </header>
  );
}
```

## Howler.js Options

`useSoundClip` accepts all [Howler.js options](https://github.com/goldfire/howler.js#options):

```tsx
const { play } = useSoundClip('/sound.mp3', {
  html5: true,          // Force HTML5 Audio
  loop: true,           // Loop playback
  preload: true,        // Preload audio
  autoplay: false,      // Auto-play on load
  mute: false,          // Start muted
  rate: 1.0,            // Playback rate
  pool: 5,              // Pool size for simultaneous playback
  format: ['mp3', 'ogg'] // Format fallback
});
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Run example app
npm run dev:example

# Watch mode for development
npm run dev
```

## Browser Support

Works in all modern browsers. Uses HTML5 Audio with Web Audio API fallback via Howler.js.

## License

MIT © Anže Matelič
