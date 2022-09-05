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

export const value = styleVariants({
  normal: typography.numbersRegular,
  big: typography.numbersLarge
});

export const label = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    selectors: {
      '&:not(:last-child)': { marginBottom: '4px' },
      '&:last-child': { marginTop: '4px' }
    }
  }
]);

export const footer = style([label]);
