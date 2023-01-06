import { style, styleVariants } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const infoBlockContainer = style({
  display: 'flex',
  flexDirection: 'column'
});

export const disabled = style([
  {
    opacity: 0.4
  }
]);

export const center = style({
  textAlign: 'center'
});

export const value = styleVariants({
  normal: typography.numbersRegular,
  big: typography.numbersLarge
});

export const label = style([
  typography.caption,
  {
    color: vars.colors.textTertiary,
    selectors: {
      '&:not(:last-child)': { marginBottom: '4px' },
      '&:last-child': { marginTop: '4px' }
    }
  }
]);

export const green = style({
  color: vars.colors.green
});

export const footer = style([label]);
