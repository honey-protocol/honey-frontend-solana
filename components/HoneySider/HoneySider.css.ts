import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../../styles/theme.css';

export const honeySider = style({
  width: '100%',
  minHeight: 'calc(100vh - 80px)',
  height: 'auto',
  maxWidth: 564,
  position: 'absolute',
  zIndex: 1,
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
      minHeight: 'calc(100vh - 100px)'
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

export const isVisible = style({
  display: 'block',
  position: 'fixed',
  bottom: '-10px',
  top: 'initial',
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
  top: 'initial',
  bottom: '-10px',
  padding: '12px 12px',
  '@media': {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      padding: '12px 0'
    }
  }
});
