import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from './theme.css';

export const container = style({
  width: '100%',
  maxWidth: 564,
  padding: '0 12px',
  margin: '0 auto',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      maxWidth: 874
    },
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      maxWidth: 1240
    }
  }
});

export const sidebar = style({
  width: '100%',
  background: vars.colors.background,
  height: 'calc(100vh - 160px)',
  pointerEvents: 'all',
  paddingTop: 15,
  '@media': {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      maxWidth: 360,
      height: 'calc(100vh - 180px)'
    }
  }
});
export const hAlign = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
});

export const pageTitle = style([
  typography.title,
  { marginBottom: '0 !important' }
]);

export const pageDescription = style([
  typography.description,
  { marginBottom: '20px', display: 'block' }
]);

export const mobileReturnButton = style({
  '@media': {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      maxWidth: 360,
      display: 'none'
    }
  }
});

export const spinner = style({});

globalStyle(`${spinner} .ant-spin-dot-item`, {
  background: vars.colors.brownDark
});

export const extLink = style({
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
});

export const showOnMobile = style({
  display: 'none',
  '@media': {
    [`screen and (max-width: ${breakpoints.tablet}px)`]: {
      display: 'flex'
    }
  }
});

export const hideOnMobile = style({
  display: 'none',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'flex'
    }
  }
});

export const textUnderline = style({
  textDecoration: 'underline'
});

export const center = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
});
