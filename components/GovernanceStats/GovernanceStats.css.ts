import { style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const governanceGraphs = style({
  display: 'flex',
  marginBottom: '16px',
  width: '100%',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      margin: '0 -12px 24px',
      width: 'calc(100% + 24px)',
      padding: '0 12px'
    }
  }
});

export const statBlock = style({
  // height: 160,
  padding: '24px 20px',
  borderRadius: 16,
  position: 'relative',
  background: vars.colors.white,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  selectors: {
    '&:not(:last-child)': {
      marginRight: 16
    }
  },
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      width: 327,
      flexShrink: 0
    }
  }
});

export const buttonWrapper = style({
  position: 'absolute',
  top: 32,
  right: 24
});

export const buttonContent = style({
  display: 'flex'
});

export const buyMoreIcon = style({
  width: 20,
  height: 20,
  marginLeft: 8,
  background: 'url("/images/arrow-button.svg") center no-repeat',
  display: 'inline-block'
});

export const getIcon = style({
  width: 20,
  height: 20,
  marginLeft: 12,
  background: 'url("/images/plus-button.svg") center no-repeat',
  display: 'inline-block'
});

export const lockPeriodBlock = style({
  flex: '0 0 auto',
  width: 'auto'
});

export const blockTitle = style({
  display: 'flex',
  flexDirection: 'column'
});

export const title = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent
  }
]);

export const yellow = style({
  color: vars.colors.brownMiddle
});

export const value = style([
  typography.numbersLarge,
  {
    marginTop: 4,
    color: vars.colors.black
  }
]);

export const lockPeriodValue = style({
  whiteSpace: 'nowrap'
});

export const lockedHoneyTitle = style({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between'
});

export const lockedLeft = style({
  textAlign: 'left'
});

export const lockedRight = style({
  textAlign: 'right'
});

export const sliderWrapper = style({
  display: 'flex',
  flexDirection: 'column'
});

export const content = style({
  height: 41
});
