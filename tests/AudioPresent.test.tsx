import { beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";

import { render, screen } from "@testing-library/react";
import { AudioPresent } from "../src/index";

interface MockAudioElement {
  play: () => Promise<void>;
  pause: () => void;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}

class MockAudio implements MockAudioElement {
  play = vi.fn().mockResolvedValue(new Promise(() => {}));
  pause = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  // Add other mock implementations as needed
}

vi.stubGlobal("Audio", MockAudio);

describe("Test for audio present", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.restoreAllMocks();
  });

  it("it render", () => {
    render(
      <AudioPresent loop={false} play={true} src="./sounds/ding.mp3">
        <button data-initial="./sounds/ding.mp3" data-exit="./sounds/jump.mp3">
          Play
        </button>
      </AudioPresent>,
    );
    expect(screen.getByText("Play")).toBeTruthy();
    // expect(Audio.mock.instances[0].play).toBeTruthy();
    // expect(Audio().play).toBeCalled();
  });
});
