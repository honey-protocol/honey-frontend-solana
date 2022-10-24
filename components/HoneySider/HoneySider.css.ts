import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../../styles/theme.css';

export const honeySider = style({
  width: '100%',
  minHeight: 'calc(100vh - 102px)',
  height: 'auto',
  maxWidth: 550,
  position: 'absolute',
  zIndex: 1,
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'none',
  pointerEvents: 'none',
  background: vars.colors.grayLight,
  padding: '12px 0',
  boxShadow: `4px 0px 0px 0px ${vars.colors.grayLight}`,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      maxWidth: 850,
      minHeight: 'calc(100vh - 90px)'
    },
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      maxWidth: 1216,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'transparent'
    }
  }
});

export const isVisible = style({
  display: 'block'
});

globalStyle(`.sidebar.is-sticky`, {
  position: 'fixed',
  top: 90
});
