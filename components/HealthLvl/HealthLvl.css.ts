import { style, styleVariants } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const health = styleVariants({
  safe: {
    color: vars.colors.green
  },
  warning: {
    color: vars.colors.brownLight
  },
  danger: {
    color: vars.colors.red
  }
});

export const healthText = style([
  typography.caption,
  {
    display: 'none',
    '@media': {
      [`screen and (min-width: ${breakpoints.tablet}px)`]: {
        display: 'initial'
      }
    }
  }
]);

export const valueCell = style([typography.numbersRegular, {}]);
export const d = style({ background: 'red' });
