import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';
import { sidebar } from '../../styles/common.css';

export const getVeHoneySidebar = style([
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  sidebar
]);

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});
export const content = style({
  borderRadius: vars.space.medium,
  overflow: 'hidden',
  background: vars.colors.white,
  minHeight: 756,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const boltIcon = style({
  width: 52,
  height: 52,
  background: 'url("/images/boltIcon.svg") center center no-repeat'
});

export const lightIcon = style({
  width: 52,
  height: 52,
  background: 'url("/images/lightIcon.svg") center center no-repeat'
});

export const secTabsContainer = style({
  padding: 20,
  paddingBottom: 0,
  height: 100
});

export const formContainer = style({
  flex: 1,
  height: 'calc(100% - 100px)'
});
