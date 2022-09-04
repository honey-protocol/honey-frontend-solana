import { style } from '@vanilla-extract/css';
import { typography } from '../../styles/theme.css';

export const headerStats = style({
  // lineHeight: 1.5
});

export const number = style({
  ...typography.numbersMini
});

export const caption = style({
  ...typography.caption
});

export const statsContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

export const progressBarWrapperWithPin = style({
  position: 'relative',
  width: '100%'
});

export const progressBarWithPin = style({
  height: 'auto'
});

export const pinContainer = style({
  position: 'absolute',
  bottom: '0.5px',
  left: '50%',
  transform: 'translateX(-50%) '
});
