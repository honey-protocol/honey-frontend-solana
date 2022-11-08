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
  alignItems: 'center'
  // paddingLeft: `${48 + 16}px`
});

export const dialectIconWrapper = style({
  marginRight: 16
});

const dialectSelector = `${dialectIconWrapper} .dialect > .dt-flex`;
globalStyle(`${dialectSelector} > .dt-relative`, {
  border: 'none',
  boxShadow: 'none',
  width: 'auto',
  height: 'auto'
});
