import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const honeyPeriod = style({
  display: 'flex'
});

export const dateWrapper = style({
  display: 'inline-block',
  marginRight: 4
});

export const value = style([
  typography.numbersLarge,
  {
    marginTop: 4,
    color: vars.colors.text
  }
]);

export const dateLetter = style([
  typography.numbersLarge,
  {
    color: vars.colors.textTertiary
  }
]);
