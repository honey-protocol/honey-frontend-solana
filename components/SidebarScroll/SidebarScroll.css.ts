import { style } from '@vanilla-extract/css';

export const SidebarScroll = style({
  height: '100%',
  position: 'relative'
});

export const content = style({
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  borderRadius: '0 0 15px 15px'
});

export const footer = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: '16px 16px 12px',
  background: 'white',
  borderRadius: '0 0 15px 15px',
  zIndex: 9
});

export const hasFooter = style({
  height: 'calc(100% - 90px)'
});
