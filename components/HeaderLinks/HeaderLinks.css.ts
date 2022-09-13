import { style } from '@vanilla-extract/css';
import { typography } from '../../styles/theme.css';

export const container = style({
  display: 'flex',
  gap: '24px',
  '@media': {
    'screen and (max-width: 768px)': {
      display: 'none'
    }
  }
});
export const title = style({
  ...typography.body,
  margin: '0 !important'
});
