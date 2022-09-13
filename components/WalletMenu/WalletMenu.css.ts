import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const title = style({
  ...typography.body,
  margin: '0px !important',
  fontSize: '16px !important'
});

export const phantomIcon = style({
  width: 20,
  height: 20,
  background: 'url("/images/phantomIcon.svg") center center no-repeat'
});
