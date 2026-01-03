import { useState } from "react";
import { useAudioContext, AudioPresent, AudioProvider } from "../src/index";
import { Component } from "react";
import { useEffect } from "react";

export default function App() {
  return (
    <ErrorBoundary>
      <AudioProvider>
        <BasicExample />
        <AddRemoveExample />
      </AudioProvider>
    </ErrorBoundary>
  );
}

const createAudio = (key, initial = "/ding.mp3", exit = "/jump.mp3") => ({
  key,
  initial,
  exit,
});

function AddRemoveExample() {
  const [audios, setAudios] = useState([]);

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
    <div>
      <AudioPresent
        src="/ding.mp3"
        default={{
          volume: 0.5,
          autoPlay: false,
        }}
        play={true}
        loop={false}
      >
        {audios.map((audio) => (
          <button
            key={audio.key}
            data-key={audio.key}
            data-initial={audio.initial}
            data-exit={audio.exit}
          >
            {audio.key}
          </button>
        ))}
      </AudioPresent>

      <button onClick={addAudio}>Add audio</button>
      <button onClick={removeAudio}>Remove audio</button>
    </div>
  );
}

function BasicExample() {
  const { getAudio } = useAudioContext();
  return (
    <div>
      <AudioPresent src="/ding.mp3" play={true} loop={false}>
        <button
          key="button-test"
          data-key="button-test"
          data-src="/ding.mp3"
          onClick={() => {
            console.log(getAudio("button-test"));
            const audio = getAudio("button-test");
            if (audio) {
              audio.play();
            }
          }}
        >
          Play sound
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
      return this.props.fallback;
    }

    return this.props.children;
  }
}
