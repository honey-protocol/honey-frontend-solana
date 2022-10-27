import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const honeyInputWithLabel = style({
  display: 'flex',
  width: '100%',
  position: 'relative',
  zIndex: 1
});

export const labelContainer = style({
  position: 'absolute',
  top: -12,
  zIndex: 3,
  left: 16,
  height: 22
});

export const label = style([
  typography.caption,
  {
    display: 'flex',
    width: '100%',
    padding: 4,
    lineHeight: 'inherit',
    color: vars.colors.brownLight,
    background: vars.colors.white
  }
]);

export const input = style({});
