import { globalStyle, style } from '@vanilla-extract/css';
import { container } from '../../styles/common.css';
import { breakpoints, vars } from '../../styles/theme.css';

export const headerContainer = style([
  container,
  {
    lineHeight: 'initial',
    height: 'unset',
    zIndex: '1'
  }
]);

export const content = style({
  width: '100%',
  background: vars.colors.foreground,
  padding: '15px',
  zIndex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'height 0.8s,background 0s, colors 0s !important',
  height: '70px',
  borderRadius: vars.space.medium
});

export const main = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  lineHeight: 'initial'
});

globalStyle(`${content}.open`, {
  height: `calc(100vh - 18px)`,
  backgroundColor: vars.colors.foreground
});

export const logo = style({
  width: 120,
  height: 40,
  background: 'url("/images/logo.svg") center center no-repeat',
  cursor: 'pointer'
});

export const leftContainer = style({
  display: 'flex',
  alignItems: 'center'
});

export const menuToggle = style({
  width: 20,
  height: 20
});

export const walletMenuBox = style({
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      order: -2
    }
  }
});

export const userIcon = style({
  width: 24,
  height: 24,
  background: 'url("/images/userIcon.svg") center center no-repeat'
});

export const userMenu = style({
  right: 0,
  borderRadius: 12,
  padding: 10
});

globalStyle(`${userMenu} .ant-dropdown-menu-item-divider`, {
  height: 2,
  width: '100%'
});

globalStyle(`${userMenu} ul`, {
  listStyle: 'none',
  padding: '0'
});

globalStyle(`${userMenu} ul li `, {
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  flexDirection: 'row-reverse'
});

globalStyle(`${userMenu} .ant-dropdown-menu-item-selected`, {
  color: vars.colors.text,
  background: 'rgba(0, 0, 0, 0.05)'
});

export const menuIconContainer = style({
  marginLeft: 20,
  display: 'flex'
});
