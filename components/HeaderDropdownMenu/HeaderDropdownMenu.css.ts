import { style } from '@vanilla-extract/css';
import { typography } from '../../styles/theme.css';

export const title = style({
  ...typography.title,
  margin: '0 !important'
});
