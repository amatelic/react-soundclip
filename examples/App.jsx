import { useState } from "react";
import {
  useAudioContext,
  AudioPresent,
  AudioProvider,
  useSoundClip,
} from "../src/index";
import { Component } from "react";
import { useEffect } from "react";

export default function App() {
  return (
    <ErrorBoundary>
      <AudioProvider>
        <div className="min-h-screen bg-gray-50 p-8">
          <Header />
          <div className="max-w-5xl mx-auto space-y-7">
            <ExampleHook />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <BasicExample />
              <AddRemoveExample />
            </div>
          </div>
        </div>
      </AudioProvider>
    </ErrorBoundary>
  );
}

function Header() {
  const { toggleMute, isMute } = useAudioContext();
  return (
    <header className="flex justify-between items-center mb-7 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Audio Playground</h1>
      <button
        onClick={toggleMute}
        className={`cursor-pointer px-5 py-2.5 rounded-lg text-white font-medium transition-all flex items-center gap-2 ${
          isMute
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {isMute ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                clipRule="evenodd"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
            Unmute All
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                clipRule="evenodd"
              />
            </svg>
            Mute All
          </>
        )}
      </button>
    </header>
  );
}

function ExampleHook() {
  const { play } = useSoundClip("/ding.mp3");
  return (
    <div className="p-7 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Hook Example</h2>
      <button
        onClick={play}
        className="cursor-pointer px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.468l-2.829-2.828m0 5.656l-2.828-2.829M19.145 11.468l-4.783-4.783M14.752 5.68v11.54m-4.783-5.656l-2.829 2.828m11.54.001l-4.783 4.783M19.145 5.68l-1.657 1.657m-4.783-4.783L5.68 19.145m11.54-11.54l-1.657-1.657"
          />
        </svg>
        Play with Hook
      </button>
    </div>
  );
}

const createAudio = (key, initial = "/ding.mp3", exit = "/jump.mp3") => ({
  key,
  initial,
  exit,
});

function AddRemoveExample() {
  const [audios, setAudios] = useState([]);
  const { isMute } = useAudioContext();

  useEffect(() => {
    setAudios([]);
  }, []);

  function addAudio() {
    setAudios([...audios, createAudio(`test-${audios.length + 1}`)]);
  }

  function removeAudio() {
    setAudios(audios.slice(0, -1));
  }

  return (
    <div className="p-7 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="cursor-pointer text-xl font-semibold text-gray-800 mb-6">
        Add/Remove Audio {isMute ? "Muted" : ""}
      </h2>
      <div className="flex gap-4 mb-6">
        <button
          onClick={addAudio}
          className="cursor-pointer px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Audio
        </button>
        <button
          onClick={removeAudio}
          className="cursor-pointer px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Remove Audio
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        <AudioPresent
          src="/ding.mp3"
          default={{ volume: 0.5, autoPlay: false }}
          play={true}
          loop={false}
        >
          {audios.map((audio) => (
            <button
              key={audio.key}
              data-key={audio.key}
              data-initial={audio.initial}
              data-exit={audio.exit}
              className="px-4 py-2 mr-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
            >
              {audio.key}
            </button>
          ))}
        </AudioPresent>
      </div>
    </div>
  );
}

function BasicExample() {
  const { getAudio, getConfig, isMute } = useAudioContext();

  return (
    <div className="p-7 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Basic Example {isMute ? "Muted" : ""}
      </h2>
      <AudioPresent src="/ding.mp3" play={true} loop={false}>
        <button
          key="button-test"
          data-key="button-test"
          data-src="/ding.mp3"
          onClick={() => {
            const audio = getAudio("button-test");
            if (!getConfig("button-test")?.isMute) {
              audio.play();
            }
          }}
          className="cursor-pointer px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.468l-2.829-2.828m0 5.656l-2.828-2.829M19.145 11.468l-4.783-4.783M14.752 5.68v11.54m-4.783-5.656l-2.829 2.828m11.54.001l-4.783 4.783M19.145 5.68l-1.657 1.657m-4.783-4.783L5.68 19.145m11.54-11.54l-1.657-1.657"
            />
          </svg>
          Play Sound
        </button>
      </AudioPresent>
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info.componentStack, React.captureOwnerStack());
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-7 bg-red-50 text-red-700 border border-red-200 rounded-xl">
          <p className="font-medium">Something went wrong.</p>
          <p className="mt-1 text-sm">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
