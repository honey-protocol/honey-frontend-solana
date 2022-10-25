import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const input = style({});

const inputRootStyle = `${input}.ant-input-affix-wrapper`;
const inputStyle = `${inputRootStyle} > input.ant-input`;
const inputClearButtonStyle = `${inputRootStyle} > .ant-input-suffix > .ant-input-clear-icon`;
const inputClearButtonSuffixStyle = `${inputRootStyle} > .ant-input-suffix`;

globalStyle(`${inputRootStyle}`, {
  width: '100%',
  borderColor: vars.colors.grayDark,
  borderRadius: 12,
  height: 52,
  padding: '0',
  boxShadow: 'none',
  borderWidth: '2px'
});

globalStyle(`${inputRootStyle}:focus, ${inputRootStyle}-focused`, {
  boxShadow: 'none',
  borderColor: vars.colors.brownLight
});

globalStyle(`${inputRootStyle}:hover, ${inputRootStyle}-hovered`, {
  boxShadow: 'none',
  borderColor: vars.colors.brownLight
});

globalStyle(`${inputRootStyle}:not(.${inputRootStyle}-disabled):hover`, {
  borderRightWidth: '2px'
});

globalStyle(`${inputStyle}`, {
  height: '100%',
  padding: 16,
  fontWeight: 500,
  fontSize: 16,
  borderRadius: 12
});

globalStyle(`${inputClearButtonStyle}`, {
  background: 'url("/images/input-clear-icon.svg") center center no-repeat',
  backgroundSize: 'contain',
  width: 12,
  height: 12
});

globalStyle(`${inputClearButtonStyle} > span`, {
  display: 'none'
});

globalStyle(`${inputClearButtonSuffixStyle}`, {
  display: 'flex',
  width: 32
});
