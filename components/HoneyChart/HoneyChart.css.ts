import { style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const honeyChart = style({
  padding: 16
});

export const honeyChartHeader = style({
  "@media": {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  },
})

export const chartTitleText = style([typography.title, {
  marginRight: "auto",
  marginBottom: 4,
  "@media": {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      marginBottom: 0,
    },
  },
}])

export const tooltip = style({
  background: vars.colors.brownLight,
  padding: '6px 8px',
  border: `2px solid ${vars.colors.black}`,
  boxShadow: `2px 2px 0px ${vars.colors.black}`,
  borderRadius: 12,
  position: "relative",
  textAlign: "center",
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
      borderRight: 'solid 14px transparent',
    }
  }
})

export const tooltipTitle = style([typography.caption, {
  color: vars.colors.grayTransparent,
  marginBottom: 2
}])
export const tooltipValue = style([typography.numbersRegular])
