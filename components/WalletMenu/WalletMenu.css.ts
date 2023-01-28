import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const title = style({
  ...typography.body,
  margin: '0px !important',
  fontSize: '16px !important'
});

export const userIcon = style({
  width: 24,
  height: 24,
  background: 'url("/images/userIcon.svg") center center no-repeat'
});

export const walletDropdownWrapper = style({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  paddingLeft: 17,
  gap: 10,
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      paddingLeft: 0
    }
  }
});

export const dialectIconWrapper = style({
  position: 'absolute',
  left: 50,
  top: 2,
  width: 20,
  pointerEvents: 'none',
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      left: 30
    }
  }
});

const dialectSelector = `${dialectIconWrapper} .dialect > .dt-flex`;
globalStyle(`${dialectSelector} > .dt-relative`, {
  border: 'none',
  boxShadow: 'none',
  width: 'auto',
  height: 'auto',
  position: 'absolute',
  top: 0,
  left: 0
});

globalStyle(`${dialectSelector} > .dt-relative button`, {
  background: vars.colors.foreground,
  pointerEvents: 'all'
});

globalStyle(`${dialectSelector} > .dt-relative button svg path`, {
  fill: vars.colors.text
});

export const row = style({
  width: '100%',
  justifyContent: 'space-between'
});

export const settingsModalContent = style({
  width: 270,
  background: vars.colors.foreground,
  padding: 10
});

export const divider = style({
  background: vars.colors.borderSecondary,
  height: 1.5,
  width: '100%'
});

export const mr5 = style({
  marginRight: '5px !important'
});

export const mobileHidden = style({
  display: 'none !important',
  '@media': {
    [`screen and (min-width: ${breakpoints.mobile}px)`]: {
      display: 'flex !important'
    }
  }
});

export const settingsIcon = style({
  cursor: 'pointer',
  width: 'unset',
  marginRight: 30
});
