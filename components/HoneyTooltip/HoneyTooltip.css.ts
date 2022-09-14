import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const container = style({
  cursor: 'pointer',
  position: 'relative',
  zIndex: 100
});

export const tooltip = style({
  position: 'absolute',
  left: '0',
  display: 'inline-flex',
  background: 'white',
  transition: 'all .5s',
  borderRadius: vars.space.medium
});

export const label = style([
  typography.description,
  {
    fontWeight: '500',
    padding: '12px 16px',
    width: 'max-content',
    maxWidth: '300px'
  }
]);
