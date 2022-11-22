import { style, globalStyle } from '@vanilla-extract/css';
import {typography, vars} from "../../styles/theme.css";
import {arrowDownIcon} from "../../styles/icons.css";

export const honeySelect = style([
  typography.numbersRegular,
  {
    display: 'flex',
    width: '100%',
    marginBottom: 4,
}])

export const honeySelectDropdownList = style([
  typography.numbersRegular,
  {
    borderRadius: 12,
  }
])

export const rootStile = `${honeySelect}.ant-select.ant-select-single.ant-select-show-arrow > .ant-select-selector`

export const rootDropdownStyle = `${honeySelectDropdownList} > div > .rc-virtual-list > .rc-virtual-list-holder > div > .rc-virtual-list-holder-inner`

globalStyle(`${rootStile}`, {
  border: `1px solid ${vars.colors.grayTransparent}`,
  borderRadius: 12,
  padding: '11px 16px',
  height: 52,
  boxShadow: "none"
})

globalStyle(`${rootDropdownStyle} > .ant-select-item-option`, {
  padding: 16,
})

globalStyle(`${rootDropdownStyle} > .ant-select-item.ant-select-item-option.ant-select-item-option-active.ant-select-item-option-selected`, {
  background: vars.colors.brownLight,
})

export const openIcon = style([
  arrowDownIcon,
  {
    backgroundSize: 'contain',
    height: 7,
    width: 13,
    marginRight: 8
}])
