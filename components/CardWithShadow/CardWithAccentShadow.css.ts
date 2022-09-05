import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const card = style({
  overflow: 'hidden',
  borderRadius: vars.space.medium,
  border: `2px solid ${vars.colors.black}`,
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`,
  marginBottom: '5px'
});
