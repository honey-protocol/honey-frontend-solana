import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';
import { pageTitle as pageTitleCommon } from './common.css';

export const dashboard = style({
  paddingBottom: 18,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      paddingBottom: 32
    }
  }
});

export const pageHeader = style({
  marginBottom: 8,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'flex',
      marginBottom: 16
    }
  }
});

export const chartContainer = style({
  padding: 12,
  paddingBottom: 0,
  width: '100%',
  height: 'auto',
  background: vars.colors.white,
  borderRadius: 16,
  marginRight: 16,
  marginBottom: 8,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      marginBottom: 0,
      height: 258
    }
  }
});

export const notificationsWrapper = style({
  width: '100%',
  marginBottom: 8,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      width: 360,
      marginBottom: 0
    }
  }
});

export const pageContentElements = style({
  display: 'flex',
  paddingBottom: 32
});

export const gridWrapper = style({
  width: '100%',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      marginRight: 16
    }
  }
});
