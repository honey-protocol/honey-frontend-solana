import { style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const honeyButton = style([
  typography.button,
  {
    borderRadius: '8px',
    padding: '10px 15px',
    height: 'unset',
    display: 'inline-flex',
    border: 'none',
    gap: '10px'
  }
]);

export const primary = style({
  background: vars.colors.brownLight,
  ':hover': {
    background: vars.colors.brownDark,
    color: vars.colors.black
  }
});

export const secondary = style({});

export const tertiary = style({
  background: vars.colors.grayMiddle,
  ':hover': {
    background: vars.colors.grayDark,
    color: vars.colors.black
  }
});

export const disabled = style({
  background: `${vars.colors.grayMiddle} !important`
});

export const fluid = style({
  width: '100%'
});
