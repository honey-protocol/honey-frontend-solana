import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../../styles/theme.css';

export const honeySider = style({
  width: '100%',
  height: '100vh',
  // height: 'auto',
  maxWidth: 564,
  background: vars.colors.background,
  position: 'absolute',
  zIndex: 10,
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'none',
  pointerEvents: 'none',
  padding: '12px 0',
  boxShadow: `4px 0px 0px 0px ${vars.colors.background}`,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      maxWidth: 874,
      height: 'calc(100vh - 100px)',
      zIndex: 1
    },
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      maxWidth: 1216,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'transparent',
      padding: '12px 0'
    }
  }
});

globalStyle(`${honeySider} > div:first-of-type`, {
  height: 'calc(100% - 15px)'
});

export const isVisible = style({
  display: 'block',
  position: 'fixed',
  bottom: '-10px',
  top: '0',
  padding: '12px 12px',
  '@media': {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      padding: '12px 0',
      position: 'absolute',
      bottom: 'initial',
      top: 0
    }
  }
});

globalStyle(`.sidebar.is-sticky`, {
  position: 'fixed',
  top: '0',
  bottom: '-10px',
  padding: '12px 12px',
  '@media': {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      padding: '12px 0',
      top: 'initial'
    }
  }
});
