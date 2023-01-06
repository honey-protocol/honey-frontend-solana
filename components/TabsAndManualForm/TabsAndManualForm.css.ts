import { style, globalStyle } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const tabs = style({
  display: 'flex',
  gap: 12
});

export const tab = style([
  typography.numbersMini,
  {
    width: '25%',
    height: 36,
    border: `2px solid ${vars.colors.grayDark}`,
    boxShadow: `2px 2px 0px ${vars.colors.grayDark}`,
    borderRadius: 12,
    background: vars.colors.foreground,
    padding: 10,
    textAlign: 'center',
    cursor: 'pointer',
    color: vars.colors.textTertiary
  }
]);

export const manualInput = style({
  width: '25%',
  height: 36,
  border: `2px solid ${vars.colors.grayDark}`,
  boxShadow: `2px 2px 0px ${vars.colors.grayDark}`,
  borderRadius: 12,
  background: vars.colors.foreground,
  cursor: 'pointer'
});

export const manualInputStyle = style([
  typography.numbersMini,
  {
    width: '100%',
    height: 33,
    textAlign: 'center'
  }
]);

globalStyle(`${manualInputStyle} .ant-input-number-input`, {
  textAlign: 'center'
});

export const manual = style([
  typography.numbersMini,
  {
    width: '100%',
    height: 33,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.colors.textTertiary
  }
]);

export const isActive = style({
  border: `2px solid ${vars.colors.borderPrimary}`,
  boxShadow: `2px 2px 0px ${vars.colors.brownLight}`,
  color: vars.colors.text
});

export const isError = style({
  border: `2px solid ${vars.colors.borderPrimary}`,
  boxShadow: `2px 2px 0px ${vars.colors.redDark}`
});

export const isErrorInput = style({
  color: vars.colors.redDark
});

export const error = style([
  typography.numbersMini,
  {
    background: vars.colors.lightRedTransparent,
    borderRadius: 12,
    color: vars.colors.redDark,
    padding: 12,
    marginTop: 12
  }
]);
