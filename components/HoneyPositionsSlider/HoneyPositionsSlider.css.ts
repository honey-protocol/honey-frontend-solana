import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

const slideIn = keyframes({
  '0%': {
    transform: 'translateX(0%)'
  },
  '50%': {
    transform: 'translateX(-100%)'
  },
  '100%': {
    transform: 'translateX(0%)'
  }
});

export const honeyPositionsSlider = style({
  width: '100%',
  borderRadius: 16,
  background: vars.colors.white,
  overflow: 'hidden',
});

export const honeyAnimationSlider = style({
  display: 'flex',
  padding: '8px 12px',
  height: 72,
  animation: `${slideIn} 30s linear infinite`,
});


globalStyle(`${honeyPositionsSlider}:hover ${honeyAnimationSlider}`, {
  animationPlayState: 'paused'
});

