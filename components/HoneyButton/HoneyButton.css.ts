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
    border: 'none',
    gap: '10px',
    transition: 'all .5s, background 0s, colors 0s !important',
    justifyContent: 'center',
    alignItems: 'center',
    ':after': {
      display: 'none!important'
    }
  }
]);

export const primary = style({
  background: vars.colors.brownLight,
  color: vars.colors.black,
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

const allTexts = style({
  position: 'relative',
  border: 'none',
  background: 'transparent',
  padding: 0,
  textTransform: 'uppercase',
  fontSize: '16px',
  boxShadow: 'none',
  alignItems: 'center'
});

export const text = style([
  typography.button,
  allTexts,
  {
    color: vars.colors.brownMiddle,
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
    }
  }
]);

export const textSecondary = style([
  typography.button,
  allTexts,
  {
    opacity: '0.4',
    ':hover': {
      opacity: '1',
      color: vars.colors.black
    },
    ':active': {
      opacity: '1',
      color: vars.colors.black
    },
    ':focus': {
      opacity: 1,
      color: vars.colors.black
    }
  }
]);

export const disabled = style({
  background: `${vars.colors.grayMiddle} !important`,
  color: `${vars.colors.textTertiary} !important`,
  ':hover': {
    transform: 'none',
    boxShadow: 'none'
  },
  ':active': {
    background: `${vars.colors.grayMiddle} !important`
  }
});

export const withValues = style({
  justifyContent: 'space-between'
});

globalStyle(`${tertiary}.${disabled}`, {
  background: 'transparent !important'
});

export const rightBlock = style({
  textAlign: 'right'
});

export const valueContainer = style([
  rightBlock,
  {
    position: 'absolute',
    right: 16,
    top: 6
  }
]);

export const valueContainerTextRight = style([
  rightBlock,
  {
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  }
]);

export const usdcAmount = style([
  typography.caption,
  {
    display: 'block'
  }
]);

export const usdcValue = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    display: 'block'
  }
]);

export const textRight = style([
  typography.numbersMini,
  {
    color: vars.colors.grayTransparent,
    textTransform: 'none'
  }
]);
