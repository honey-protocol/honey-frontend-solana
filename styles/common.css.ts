import { style } from '@vanilla-extract/css';
import { breakpoints } from './theme.css';

export const container = style({
  width: '100%',
  maxWidth: 564,
  padding: '0 12px',
  margin: '0 auto',
  "@media": {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      maxWidth: 874,
    },
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      maxWidth: 1240,
    },
  },
});

export const widthSidebar  = style({
  width: '100%',
  height: 'calc(100vh - 102px)',
  pointerEvents: 'all',
  "@media": {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      maxWidth: 350,
    },
  },
});
export const hAlign = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
});
