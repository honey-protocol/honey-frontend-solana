import { style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const honeyLineChart = style({
  display: 'flex',
  position: 'relative',
  height: `calc(100% - 30px)`
});

const axisYWidth = 35;

export const axisY = style([
  typography.numbersMini,
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: axisYWidth,
    color: vars.colors.grayTransparent
  }
]);

export const axisX = style([
  typography.numbersMini,
  {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    color: vars.colors.grayTransparent,
    bottom: -13,
    left: axisYWidth,
    width: `calc(100% - ${axisYWidth}px)`
  }
]);

export const xAxisTitle = style([
  typography.numbersMini,
  {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 5
  }
]);
