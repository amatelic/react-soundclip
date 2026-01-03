// TODO: implement the the source for every components
// add suport for muting all
// find a way how to add audio to only selected items
export interface AudioContextProps {
  volume: number;
  autoPlay: boolean;
}

export type AudioPreset = {
  src: string;
};

export interface AudioChildProps {
  key?: string | number;
  "data-initial"?: string | boolean;
  "data-exit"?: string | boolean;
  "data-volume"?: number;
  "data-src": string;
}
