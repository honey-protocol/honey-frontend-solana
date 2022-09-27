import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const repayForm = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: vars.colors.white,
  padding: 16
});

const formSection = style([
  {
    marginBottom: '24px'
  }
]);

export const row = style([
  formSection,
  {
    display: 'flex'
  }
]);

export const col = style({
  flex: '100% 0 0',
  paddingRight: 8
});

export const nftInfo = style([
  formSection,
  row,
  {
    alignItems: 'center'
  }
]);
export const nftImage = style([
  {
    width: 46,
    height: 46,
    marginRight: 15
  }
]);
export const nftName = style([typography.title, {}]);

export const balance = style({
  marginBottom: 0
});

export const inputs = style([
  {
    paddingTop: 16,
    backgroundImage: `linear-gradient(to right, ${vars.colors.black} 50%, transparent 50%)`,
    backgroundPosition: 'left top, left bottom, left top, right top',
    backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
    backgroundSize: '20px 2px, 20px 2px, 2px 20px, 2px 20px',
    marginBottom: 16
  }
]);

export const buttons = style([
  {
    display: 'flex'
  }
]);

export const smallCol = style([
  {
    flex: '0 0 auto',
    marginRight: '12px'
  }
]);

export const bigCol = style([
  {
    flex: '1 0 auto'
  }
]);

export const extLink = style({
  color: vars.colors.brownMiddle,
  ':hover': {
    background: 'transparent',
    color: vars.colors.brownDark
  },
  ':active': {
    background: 'transparent',
    color: vars.colors.brownDark,
    borderColor: 'transparent'
  },
  ':focus': {
    background: 'transparent',
    color: vars.colors.brownDark,
    borderColor: 'transparent'
  }
});
