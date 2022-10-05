export type CollectionPosition = {
  name: string;
  value: number;
  difference: number;
  image: string;
};

export interface SliderPositionProps {
  position: CollectionPosition;
}

export interface HoneyPositionsSliderProps {
  positions: Array<CollectionPosition>;
}
