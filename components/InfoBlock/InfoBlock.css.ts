import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
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

export const wrapThis = style({
  display: 'flex',
  alignItems: 'center'
})

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

export const green = style({
  color: vars.colors.green
});

export const footer = style([label]);

export const logoWrapper = style({
  marginRight: 12,
  display: 'flex'
});

export const collectionLogo = style({
  width: '34px',
  height: '34px',
  minWidth: '34px',
  flexShrink: 0
});

export const mainWrapper = style({
  display: 'none !important'
})