import { style } from '@vanilla-extract/css';

// TODO: add breakpoints settings here
export const container = style({
  width: '100%',
  maxWidth: 1240,
  margin: 'auto'
});

export const hAlign = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
});
