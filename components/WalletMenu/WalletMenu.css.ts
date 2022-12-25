import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

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
  paddingLeft: `${17}px`
});

export const dialectIconWrapper = style({
  position: 'absolute',
  left: -10,
  top: 2,
  pointerEvents: 'none'
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
