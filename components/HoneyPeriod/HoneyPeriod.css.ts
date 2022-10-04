import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const honeyPeriod = style({
  display: 'flex'
});

export const dateWrapper = style({
  display: 'inline-block',
  marginRight: 4
});

export const dateLetter = style([
  typography.numbersLarge,
  {
    color: vars.colors.grayTransparent
  }
]);
