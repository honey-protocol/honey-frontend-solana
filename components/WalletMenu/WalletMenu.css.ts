import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const title = style({
  ...typography.body,
  margin: '0px !important'
});

export const caption = style({
  ...typography.caption,
  fontWeight: '500'
});
