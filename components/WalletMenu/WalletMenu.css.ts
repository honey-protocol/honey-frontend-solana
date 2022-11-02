import { style } from '@vanilla-extract/css';
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
