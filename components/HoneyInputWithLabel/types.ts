import { HoneyInputProps } from '../HoneyInput/types';

export type HoneyInputWithLabelProps = HoneyInputProps & {
  // label appear on top of the input if focused
  label: string;
  // force label visibility
  forceLabel?: boolean;
};
