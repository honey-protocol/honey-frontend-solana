import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const title = style({
  ...typography.body,
  margin: '0px !important',
  fontSize: '16px !important',
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      display: 'none'
    }
  }
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
  gap: 10
});

export const dialectIconWrapper = style({
  position: 'absolute',
  left: 50,
  top: 2,
  width: 20,
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

export const userMenu = style({
  right: 0,
  borderRadius: 12,
  padding: 10
});

globalStyle(`${userMenu} .ant-dropdown-menu-item-divider`, {
  height: 2,
  width: '100%'
});

globalStyle(`${userMenu} ul`, {
  listStyle: 'none',
  padding: '0'
});

globalStyle(`${userMenu} ul li `, {
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  flexDirection: 'row-reverse'
});

globalStyle(`${userMenu} .ant-dropdown-menu-item-selected`, {
  color: vars.colors.text,
  background: 'rgba(0, 0, 0, 0.05)'
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
