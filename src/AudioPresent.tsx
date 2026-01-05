import {
  useEffect,
  useRef,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { useAudioContext } from "./useAudioContext";
import { isValid, normalizeValue, traverseToLastChild } from "./utils/utils";
import { AudioPreset } from "./types";
import * as React from "react";
import { Howl } from "howler";

export const AudioPresent = ({
  children,
  src,
}: PropsWithChildren<AudioPreset>) => {
  const containerRef = useRef(null);

  const { getConfig, setAudio, removeAudio, isMute } = useAudioContext();
  const prevChildrenRef = useRef<React.ReactNode[]>([]);

  function mountAudio(element: HTMLHtmlElement) {
    const dataset = element.dataset;
    if (!isMute) {
      setAudio(dataset.key, {
        hasPlayed: false,
        src: dataset.src,
        initial: normalizeValue(dataset.initial),
        exits: normalizeValue(dataset.exit),
        volume: (dataset.volume || 1) as number,
        isMute: isMute,
      });
    }
  }

  function unmountAudio(element: HTMLHtmlElement) {
    const dataset = element.dataset;
    const audio = getConfig(dataset.key);
    if (!audio) {
      return;
    }
    if (audio.exits && !isMute) {
      const player = new Howl({
        src: audio.exits,
        onend: function () {
          removeAudio(dataset.key);
          player.unload();
        },
      });
      player.play();
    }
  }

  useEffect(() => {
    if (!containerRef.current) return;
    React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) {
        return;
      }
      setAudio(child.props["data-key"], {
        hasPlayed: false,
        src: child.props["data-src"],
        initial: normalizeValue(child.props["data-initial"]),
        exits: normalizeValue(child.props["data-exit"]),
        volume: (child.props["data-volume"] || 1) as number,
        isMute: isMute,
      });
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((el) => {
          if (!isMute) {
            mountAudio(el as HTMLHtmlElement);
          }
        });
        mutation.removedNodes.forEach((el) => {
          if (!isMute) {
            unmountAudio(el as HTMLHtmlElement);
          }
        });
      });
    });
    observer.observe(containerRef.current, {
      attributes: true,
      childList: true, // Observe direct children
      subtree: true, // Observe all descendants
    });

    return () => observer.disconnect(); // Cleanup
  }, [isMute]);

  return <div ref={containerRef}>{children}</div>;
};
