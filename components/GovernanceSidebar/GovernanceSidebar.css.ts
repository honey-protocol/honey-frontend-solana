import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';
import { sidebar } from '../../styles/common.css';

export const governanceSidebar = style([
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  sidebar
]);

export const content = style({
  borderRadius: vars.space.medium,
  overflow: 'hidden',
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
