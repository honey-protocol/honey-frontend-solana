import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const SidebarScroll = style({
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column'
});

export const content = style({
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  borderRadius: '0 0 15px 15px'
});

export const footer = style({
  width: '100%',
  flex: 'auto',
  padding: '16px 16px 12px',
  background: vars.colors.foreground,
  borderRadius: '0 0 15px 15px',
  zIndex: 9
});
