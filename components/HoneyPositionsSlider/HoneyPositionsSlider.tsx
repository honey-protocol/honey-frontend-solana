import { FC } from 'react';
import * as styles from './HoneyPositionsSlider.css';
import { SliderPosition } from './SliderPosition/SliderPosition';
import { HoneyPositionsSliderProps } from './types';

export const HoneyPositionsSlider: FC<HoneyPositionsSliderProps> = ({
  positions
}) => {
  return (
    <div className={styles.honeyPositionsSlider}>
      <div className={styles.honeyAnimationSlider}>
        {positions.map((position, index) => (
          <SliderPosition key={index} position={position} />
        ))}
      </div>
    </div>
  );
};
