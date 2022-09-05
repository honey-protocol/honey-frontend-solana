import { style } from '@vanilla-extract/css';
import { typography } from './theme.css';

export const marketsPage = style({});

export const nameCell = style({
  display: 'flex',
  alignItems: 'center'
});

export const collectionLogo = style({
  marginRight: '16px',
  width: '34px',
  height: '34px'
});

export const collectionName = style([
  typography.body,
  {
    width: 124,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
]);

export const availableCell = style([typography.numbersRegular, {}]);
export const valueCell = style([typography.numbersRegular, {}]);
export const rateCell = style([typography.numbersRegular, {}]);

export const buttonsCell = style({
  display: 'flex',
  justifyContent: 'flex-end'
});