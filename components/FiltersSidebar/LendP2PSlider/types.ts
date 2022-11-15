export type LendP2PSliderProps = {
  currentValue: [number, number];
  maxValue: number;
  onChange: (value: [number, number]) => void;
  minValue: number;
  labelsFormatter?: (value: number) => string;
};
