import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const honeyButton = style([
  typography.button,
  {
    borderRadius: '8px',
    padding: '10px 15px',
    height: 'unset',
    display: 'inline-flex',
    border: 'none',
    gap: '10px',
    transition: 'all .5s'
  }
]);

export const primary = style({
  background: vars.colors.brownLight,
  ':hover': {
    color: vars.colors.black,
    background: vars.colors.brownLight,
    transform: 'translateY(-4px)',
    boxShadow: `0px 4px 2px 0px ${vars.colors.brownDark}`
  },
  ':active': {
    background: `${vars.colors.brownDark} !important`
  },
  ':focus': {
    background: `${vars.colors.brownDark}`,
    color: vars.colors.black
  }
});

export const secondary = style({
  background: vars.colors.secondaryBrownLight,
  color: vars.colors.brownMiddle,
  ':hover': {
    background: vars.colors.secondaryBrownLight,
    color: vars.colors.brownMiddle,
    transform: 'translateY(-4px)',
    boxShadow: `0px 4px 2px 0px ${vars.colors.secondaryBrownMiddle}`
  },
  ':active': {
    background: `${vars.colors.secondaryBrownMiddle} !important`
  },
  ':focus': {
    background: `${vars.colors.secondaryBrownMiddle}`,
    color: vars.colors.brownMiddle
  }
});

export const tertiary = style({
  background: 'transparent',
  color: vars.colors.brownMiddle,
  ':hover': {
    background: vars.colors.secondaryBrownLight,
    color: vars.colors.brownMiddle,
    transform: 'translateY(-4px)',
    boxShadow: `0px 4px 2px 0px ${vars.colors.secondaryBrownMiddle}`
  },
  ':active': {
    background: `${vars.colors.secondaryBrownMiddle} !important`
  },
  ':focus': {
    background: `${vars.colors.secondaryBrownMiddle}`,
    color: vars.colors.brownMiddle
  }
});

export const disabled = style({
  background: `${vars.colors.grayMiddle} !important`,
  ':hover': {
    transform: 'none',
    boxShadow: 'none'
  },
  ':active': {
    background: `${vars.colors.grayMiddle} !important`
  }
});

globalStyle(`${tertiary}.${disabled}`, {
  background: 'transparent !important'
});

export const fluid = style({
  width: '100%'
});
