import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';
import { honeyFormattedInput } from '../HoneyFormattedNumericInput/HoneyFormattedNumericInput.css';

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
  background: vars.colors.foreground,
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
        color: vars.colors.textTertiary
      }
    }
  }
]);

globalStyle(`${input} .ant-input-number-input`, {
  height: 'auto',
  padding: '0'
});

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
    alignItems: 'center',
    gap: 6,
    color: vars.colors.textTertiary
  }
]);

export const delimiterIcon = style({
  width: 20,
  height: 20
});
