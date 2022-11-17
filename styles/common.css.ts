import { style } from '@vanilla-extract/css';
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
  height: 'calc(100vh - 180px)',
  pointerEvents: 'all',
  '@media': {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      maxWidth: 360,
      height: 'calc(100vh - 160px)'
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
