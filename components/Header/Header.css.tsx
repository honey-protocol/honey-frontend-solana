import { style } from '@vanilla-extract/css';
import { sprinkles, vars } from '../../styles/theme.css';

export const headerContainer = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export const logo = style({
  width: 120,
  height: 40,
  backgroundColor: 'red',
  color: vars.colors.white,
  background: 'url("/images/logo.svg") center center no-repeat'
});
