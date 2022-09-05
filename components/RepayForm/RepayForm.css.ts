import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const repayForm = style({
  width: '100%',
  height: '100%',
  minHeight: 756,
  background: vars.colors.white,
  padding: 16
});
