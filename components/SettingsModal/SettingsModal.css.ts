import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const divider = style({
  background: vars.colors.borderSecondary,
  height: 1.5,
  width: '100%'
});

export const settingsModalContent = style({
  minWidth: 350,
  background: vars.colors.foreground,
  padding: 30
});

export const row = style({
  width: '100%',
  justifyContent: 'space-between'
});

export const settingTitle = style([typography.description]);

export const dropdownSelect = style({
  // background: 'red'
});

globalStyle(`${dropdownSelect} .ant-select-selector`, {
  borderRadius: '10px !important',
  fontFamily: 'Scandia',
  fontWeight: '500 !important'
});

globalStyle(`${dropdownSelect} .ant-space-item `, {
  display: 'flex'
});

globalStyle(`${dropdownSelect} .ant-select-selector svg`, {
  width: 20,
  height: 20
});

globalStyle(`${dropdownSelect} .ant-select-selector svg path`, {
  fill: 'var(--colors-text)'
});

export const selectDropdownList = style({});

globalStyle(`${selectDropdownList} svg`, {
  width: 20,
  height: 20
});

export const modalTitle = style([
  typography.title,
  {
    display: 'flex',
    justifyContent: 'center'
  }
]);
