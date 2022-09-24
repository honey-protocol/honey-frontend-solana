import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const card = style({
  borderRadius: vars.space.medium,
  border: `2px solid ${vars.colors.black}`,
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`,
  marginBottom: '5px',
  overflow: 'hidden',

  '@media': {
    'screen and (max-width: 768px)': {
      boxShadow: `2px 2px 0px 0px ${vars.colors.brownLight}`
    }
  }
});
