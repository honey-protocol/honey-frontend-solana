import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const inputsBlockContainer = style({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  border: '1px solid',
  borderColor: vars.colors.grayDark,
  borderRadius: '12px'
});

export const equalSignContainer = style({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%,-50%)',
  background: vars.colors.white,
  minWidth: 20,
  minHeight: 20
});

export const inputWrapper = style({
  height: 52,
  position: 'relative',
  selectors: {
    '&:not(:last-child)': {
      borderBottom: '1px dashed',
      borderColor: vars.colors.grayDark
    }
  }
});

export const input = style([
  typography.numbersRegular,
  {
    width: '100%',
    height: '100%',
    border: 'transparent',
    padding: '16px',
    background: 'transparent',

    selectors: {
      '&:focus': {
        borderColor: 'transparent',
        outline: 0,
        boxShadow: 'none'
      },
      '&::placeholder': {
        color: vars.colors.grayTransparent
      }
    }
  }
]);

export const inputAddon = style([
  typography.body,
  {
    position: 'absolute',
    right: 0,
    marginRight: 16,
    top: '50%',
    transform: 'translate(0,-50%)',
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    color: vars.colors.grayTransparent
  }
]);

export const delimiterIcon = style({
  width: 20,
  height: 20
});
