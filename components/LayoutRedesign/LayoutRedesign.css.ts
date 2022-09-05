import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const layout = style({});

globalStyle(`body ${layout} .ant-layout-header`, {
  backgroundColor: vars.colors.white
});

globalStyle(`body ${layout} .ant-layout-sider`, {
  backgroundColor: 'transparent'
});
