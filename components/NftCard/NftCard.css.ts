import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const nftCard = style([
  {
    display: 'flex',
    alignItems: 'flex-start',
    paddingBottom: 14,
    cursor: 'pointer'
  }
]);

export const nftRight = style([
  {
    width: 'calc(100% - 52px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
]);

export const hasBorder = style({
  backgroundImage: `linear-gradient(to right, ${vars.colors.grayDark} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px'
});

export const nftImage = style([
  {
    width: 40,
    height: 40,
    marginRight: 12,
    display: 'flex'
  }
]);

export const nftDescription = style({});

export const nftName = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    marginBottom: '2px'
  }
]);

export const nftLabel = style([
  typography.numbersRegular,
  {
    color: vars.colors.black
  }
]);

export const hint = style([
  typography.caption,
  {
    color: vars.colors.black
  }
]);

export const arrowRight = style([
  {
    width: 20,
    height: 20,
    background: 'url(/images/arrow.svg) center no-repeat',
    transform: 'rotate(-90deg)'
  }
]);
