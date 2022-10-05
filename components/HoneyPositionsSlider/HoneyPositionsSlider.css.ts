import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const honeyPositionsSlider = style({
  width: '100%',
  padding: '8px 12px',
  borderRadius: 16,
  height: 72,
  background: vars.colors.white,
  display: 'flex',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
});
