import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const userMenu = style({
  right: 0,
  borderRadius: 12,
  padding: 10
});

globalStyle(`${userMenu} .ant-dropdown-menu-item-divider`, {
  height: 2,
  width: '100%'
});

globalStyle(`${userMenu} ul`, {
  listStyle: 'none',
  padding: '0'
});

globalStyle(`${userMenu} ul li `, {
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  flexDirection: 'row-reverse'
});

globalStyle(`${userMenu} .ant-dropdown-menu-item-selected`, {
  color: vars.colors.text,
  background: 'rgba(0, 0, 0, 0.05)'
});

export const row = style({
  width: '100%',
  justifyContent: 'space-between'
});

export const settingsModalContent = style({
  width: 270,
  background: vars.colors.foreground,
  padding: 10
});

export const divider = style({
  background: vars.colors.borderSecondary,
  height: 1.5,
  width: '100%'
});

export const settingsDropdown = style({
  width: 'unset',
  marginRight: 30
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
