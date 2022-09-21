import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';
import { container } from '../../styles/common.css';

export const headerContainer = style([
  container,
  {
    lineHeight: 'initial',
    padding: '0',
    height: 'unset',
    zIndex: '1'
  }
]);

export const content = style({
  width: '100%',
  background: vars.colors.white,
  padding: '15px',
  zIndex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'all 1.5s',
  height: '70px'
});

export const main = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  lineHeight: 'initial'
});

globalStyle(`${content}.open`, {
  height: '100vh'
});

export const logo = style({
  width: 120,
  height: 40,
  background: 'url("/images/logo.svg") center center no-repeat'
});

export const leftContainer = style({
  display: 'flex',
  alignItems: 'center'
});

export const menuToggle = style({
  display: 'none',
  width: 20,
  height: 20,
  '@media': {
    'screen and (max-width: 768px)': {
      display: 'block'
    }
  }
});

export const menuOpen = style({
  background: 'url("/images/menuIcon.svg") center center no-repeat'
});

export const menuClose = style({
  background: 'url("/images/menu-close.svg") center center no-repeat'
});
