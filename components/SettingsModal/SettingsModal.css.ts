import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const divider = style({
  background: vars.colors.borderSecondary,
  height: 1.5,
  width: '100%'
});

export const settingsModalContent = style({
  width: 300,
  background: vars.colors.foreground
});

export const row = style({
  width: '100%',
  justifyContent: 'space-between'
});
