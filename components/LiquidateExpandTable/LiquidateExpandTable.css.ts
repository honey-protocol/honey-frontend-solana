import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const expandTableHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 16,
  paddingRight: 24,
  marginTop: 12
});

export const positionsCounterContainer = style({
  display: 'flex',
  alignItems: 'center'
});

export const positionsCounterTitle = style([typography.title]);

export const positionsCount = style([
  typography.numbersRegular,
  {
    padding: '3px 4px',
    borderRadius: 8,
    background: vars.colors.grayMiddle,
    marginLeft: 8
  }
]);
