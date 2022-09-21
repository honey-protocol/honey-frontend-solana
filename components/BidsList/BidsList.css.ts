import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const bidsList = style({
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
  flex: '100% 0 0'
});

export const nftInfo = style([
  row,
  {
    alignItems: 'center',
    marginBottom: 16
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
  marginBottom: 16
});

export const inputs = style([
  {
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
