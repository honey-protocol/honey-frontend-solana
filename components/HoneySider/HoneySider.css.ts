import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from '../../styles/theme.css';

export const honeySider = style({
  width: '100%',
  maxWidth: 550,
  position: 'fixed',
  zIndex: 1,
  top: 90,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'none',
  pointerEvents: 'none',
  paddingTop: 12,
  background: vars.colors.grayLight,
  boxShadow: `4px 0px 0px 0px ${vars.colors.grayLight}`,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      maxWidth: 850
    },
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      maxWidth: 1216,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'transparent'
    }
  }
});

export const honeySiderShow = style({
  display: 'block'
});
