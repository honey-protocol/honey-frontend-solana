import { style } from '@vanilla-extract/css';
import { breakpoints } from '../../styles/theme.css';

export const honeyContent = style({
  width: '100%',
  "@media": {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      paddingRight: 374
    },
  },
});

