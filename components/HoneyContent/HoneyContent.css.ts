import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints } from '../../styles/theme.css';

export const honeyContent = style({
  width: '100%',
  minHeight: 'calc(100vh - 102px)',
  position: 'relative',
  '@media': {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      paddingRight: 384
    }
  }
});

globalStyle(`.hasNoSider`, {
  minHeight: '0',
  '@media': {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      paddingRight: 0
    }
  }
});
