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

  const { getConfig, setAudio, removeAudio } = useAudioContext();
  const prevChildrenRef = useRef<React.ReactNode[]>([]);

  function mountAudio(element: HTMLHtmlElement) {
    const dataset = element.dataset;
    setAudio(dataset.key, {
      hasPlayed: false,
      src: dataset.src,
      initial: normalizeValue(dataset.initial),
      exits: normalizeValue(dataset.exit),
      volume: (dataset.volume || 1) as number,
    });
  }

  function unmountAudio(element: HTMLHtmlElement) {
    const dataset = element.dataset;
    const audio = getConfig(dataset.key);
    if (!audio) {
      return;
    }
    if (audio.exits) {
      const player = new Howl({
        src: audio.exits,
        onend: function () {
          removeAudio(dataset.key);
        },
      });
      player.play();
    }
  }

  // useEffect(() => {
  //   const currentChildrens = React.Children.toArray(children);
  //   (currentChildrens || []).forEach((currentChildren) => {
  //     if (!prevChildrenRef.current?.includes(currentChildren)) {
  //       const elements = traverseToLastChild(currentChildren as any);

  //       elements.forEach((el) => {
  //         if (el) {
  //           mountAudio(el);
  //         }
  //       });
  //     }
  //   });

  //   let previousNodes = prevChildrenRef.current || [];
  //   // remove items
  //   previousNodes.forEach((currentChildren, index) => {
  //     if (previousNodes.includes(currentChildrens)) {
  //       return;
  //     }
  //     const elements = traverseToLastChild(currentChildren);

  //     elements.forEach((el) => {
  //       if (el) {
  //         unmountAudio(el);
  //       }
  //     });
  //   });

  //   // Update the ref with current children
  //   prevChildrenRef.current = currentChildrens;
  // }, [children]);

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
      });
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((el) => mountAudio(el as HTMLHtmlElement));
        mutation.removedNodes.forEach((el) =>
          unmountAudio(el as HTMLHtmlElement),
        );
      });
    });

    observer.observe(containerRef.current, {
      attributes: true,
      childList: true, // Observe direct children
      subtree: true, // Observe all descendants
    });

    return () => observer.disconnect(); // Cleanup
  }, []);

  return <div ref={containerRef}>{children}</div>;
};
