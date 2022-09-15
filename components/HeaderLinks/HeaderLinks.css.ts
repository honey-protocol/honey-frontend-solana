import { globalStyle, style } from '@vanilla-extract/css';
import { typography } from '../../styles/theme.css';

export const container = style({
  display: 'flex',
  padding: '0',
  margin: '0',
  listStyle: 'none',
  gap: '24px',
  '@media': {
    'screen and (max-width: 768px)': {
      display: 'none'
    }
  }
});

export const activeLink = style({});

globalStyle(`${activeLink} a`, {
  opacity: 1
});

globalStyle(`${container} li`, {
  display: 'flex',
  alignItems: 'center'
});

globalStyle(`${container} li`, {
  display: 'flex',
  alignItems: 'center'
});

export const title = style({
  ...typography.body,
  margin: '0 !important'
});
