import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const honeyPosition = style({
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  position: 'relative'
});

export const collectionIconWrapper = style({
  width: 34,
  height: 34,
  flexShrink: 0
});

export const honeyPositionValues = style({
  marginLeft: 11,
  display: 'flex',
  flexDirection: 'column'
});

export const honeyPositionName = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    marginBottom: 4,
    whiteSpace: 'nowrap',
    maxWidth: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
]);

export const honeyPositionDigits = style({
  display: 'flex'
});

export const honeyPositionPrice = style([
  typography.numbersMini,
  {
    color: vars.colors.black,
    whiteSpace: 'nowrap'
  }
]);

export const honeyPositionDifference = style([
  typography.numbersMini,
  {
    marginLeft: 6,
    color: vars.colors.green,
    display: 'flex'
  }
]);

export const stonksPositionIcon = style({
  width: 12,
  height: 15,
  background: 'url("/images/stonks-position.svg") center no-repeat',
  marginRight: 2
});

export const verticalDivider = style({
  position: 'absolute',
  width: 2,
  height: 20,
  background: 'url("/images/vertical-divider.svg") center',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)'
});
