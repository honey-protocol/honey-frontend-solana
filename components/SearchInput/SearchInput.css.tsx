import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const searchInput = style({});
const inputSelector = `.ant-input-affix-wrapper.${searchInput}`;
const inputFocusedSelector = `.ant-input-affix-wrapper-focused.${searchInput}`;

globalStyle(inputSelector, {
  border: 'none',
  background: 'transparent'
});

globalStyle(`${inputSelector} .ant-input-prefix`, {
  marginRight: 24
});

globalStyle(`${inputSelector} .ant-input`, {
  ...typography.button,
  border: 'none',
  background: 'transparent'
});

globalStyle(
  `${inputFocusedSelector}, ${inputSelector}:focus, ${inputSelector}:active`,
  {
    boxShadow: 'none'
  }
);

globalStyle(
  `${inputFocusedSelector} svg *, ${inputSelector}:focus svg *, ${inputSelector}:active svg *`,
  {
    fill: vars.colors.brownLight
  }
);
