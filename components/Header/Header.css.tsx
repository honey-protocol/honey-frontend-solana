import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';
import { container } from '../../styles/common.css';

export const headerContainer = style([
  container,
  {
    background: vars.colors.white,
    lineHeight: 'initial',
    padding: '0',
    height: 'unset',
    zIndex: '1'
  }
]);

export const content = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  lineHeight: 'initial',
  padding: '15px',
  zIndex: '1'
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
