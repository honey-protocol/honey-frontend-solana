import { style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const honeyChart = style({});

export const honeyChartHeader = style({
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  }
});

export const chartTitle = style({
  marginRight: 'auto',
  marginBottom: 12,
  display: 'flex',
  flexDirection: 'column',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      marginBottom: 0
    }
  }
});

export const chartTitleText = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    marginBottom: 4,
    display: 'flex'
  }
]);

export const chartTitleValue = style([
  typography.numbersLarge,
  {
    color: vars.colors.black
  }
]);

export const titleTooltipIcon = style({
  width: 12,
  height: 12,
  background: 'url("/images/tooltip-icon.svg") center no-repeat',
  marginLeft: 4
});

export const tooltip = style({
  background: vars.colors.brownLight,
  padding: '6px 8px',
  border: `2px solid ${vars.colors.black}`,
  boxShadow: `2px 2px 0px ${vars.colors.black}`,
  borderRadius: 12,
  position: 'relative',
  textAlign: 'center',
  selectors: {
    '&:after': {
      zIndex: -1,
      position: 'absolute',
      top: '98.1%',
      left: 'calc(50% + 14px)',
      marginLeft: '-25%',
      content: '',
      width: 0,
      height: 0,
      borderTop: `solid 9px ${vars.colors.black}`,
      borderLeft: 'solid 14px transparent',
      borderRight: 'solid 14px transparent'
    }
  }
});

export const tooltipTitle = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    marginBottom: 2
  }
]);
export const tooltipValue = style([typography.numbersRegular]);

export const tooltipDot = style({
  width: 6,
  height: 6,
  border: `2px solid ${vars.colors.brownLight}`,
  background: vars.colors.white,
  borderRadius: '50%'
});
