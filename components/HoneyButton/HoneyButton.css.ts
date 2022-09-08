import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const honeyButton = style([
  typography.button,
  {
    borderRadius: '8px',
    padding: '10px 15px',
    height: 'unset',
    display: 'flex',
    // display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    gap: '10px',
    transition: 'all .5s',
    ':after': {
      display: 'none!important'
    }
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
  ':focus': {
    background: vars.colors.brownDark,
    color: vars.colors.black
  },
  ':active': {
    background: vars.colors.brownDark,
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

export const text = style([
  typography.button,
  {
    position: 'relative',
    border: 'none',
    background: 'transparent',
    color: vars.colors.brownMiddle,
    textTransform: 'uppercase',
    padding: 0,
    fontSize: '16px',
    alignItems: 'center',
    boxShadow: 'none',
    ':hover': {
      background: 'transparent',
      color: vars.colors.brownDark
    },
    ':active': {
      background: 'transparent',
      color: vars.colors.brownDark,
      borderColor: 'transparent'
    },
    ':focus': {
      background: 'transparent',
      color: vars.colors.brownDark,
      borderColor: 'transparent'
    },
    ':before': {
      content: '',
      position: 'absolute',
      top: '0',
      right: '0',
      width: '10px',
      height: '10px',
      background: 'red'
    }
  }
]);

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
