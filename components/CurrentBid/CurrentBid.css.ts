import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const CurrentBidContainer = style({
  background: vars.colors.foreground,
  border: `2px solid ${vars.colors.borderSecondary}`,
  boxShadow: `2px 2px 0px ${vars.colors.borderSecondary}`,
  borderRadius: 12,
  padding: '10px 14px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});
