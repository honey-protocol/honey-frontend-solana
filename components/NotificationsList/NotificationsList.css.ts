import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const notificationList = style({});

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