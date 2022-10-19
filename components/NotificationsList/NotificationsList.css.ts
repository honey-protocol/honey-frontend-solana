import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const notificationList = style({
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      marginBottom: 16,
    }
  }
});

export const notification = style({
  padding: '16px 16px 12px',
  background: vars.colors.white,
  borderRadius: 16,
  marginBottom: 4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const notificationTitle = style([
  typography.title,
  {
    color: vars.colors.black
  }
]);

export const notificationToggle = style([
  typography.button,
  {
    color: vars.colors.black,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
]);

export const hasBorder = style({ position: 'relative' });

globalStyle(`${hasBorder}:last-child:after`, {
  position: 'absolute',
  content: '',
  bottom: '-8px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 32px)',
  height: 40,
  borderRadius: 16,
  background: vars.colors.white,
  zIndex: 0
});

globalStyle(`${hasBorder}:last-child::before`, {
  position: 'absolute',
  content: '',
  bottom: '0',
  left: 0,
  width: '100%',
  height: '100%',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.04)',
  zIndex: 1,
  pointerEvents: 'none',
  borderRadius: 16
});