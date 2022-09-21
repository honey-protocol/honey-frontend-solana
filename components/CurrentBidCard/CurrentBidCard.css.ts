import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const bidCard = style({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '14px 0'
});

export const hasBorder = style({
  backgroundImage: `linear-gradient(to right, ${vars.colors.grayDark} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px'
});

export const bidCardCopy = style({
  width: '100%',
  overflow: 'hidden'
});

export const bidCardCopyIcon = style({
  width: '20px',
  height: '20px',
  background: 'url("/images/Copy.svg") center no-repeat',
  flexShrink: 0,
  marginLeft: 5,
  cursor: 'pointer'
});

export const bidCardLeft = style({
  width: '100%',
  overflow: 'hidden',
  marginRight: '12px',
  display: 'flex'
});

export const bidCardDate = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    marginBottom: 0,
    textTransform: 'lowercase'
  }
]);

export const bidCardAddress = style([
  typography.numbersRegular,
  {
    color: vars.colors.black,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: 2
  }
]);

export const bidCardRight = style({
  flexShrink: 0,
  textAlign: 'right'
});

export const bidCardPrice = style([
  typography.numbersRegular,
  {
    marginBottom: 2
  }
]);

export const bidCardUsdcCounts = style([
  typography.numbersMini,
  {
    color: vars.colors.grayTransparent,
    whiteSpace: 'nowrap',
    marginBottom: 0
  }
]);