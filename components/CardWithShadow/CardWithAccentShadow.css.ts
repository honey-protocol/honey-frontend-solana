import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const card = style({
  overflow: 'hidden',
  borderRadius: vars.space.medium,
  border: '2px solid black',
  boxShadow: '4px 4px 0px 0px rgba(231, 180, 0, 1)',
  marginBottom: '5px'
});
