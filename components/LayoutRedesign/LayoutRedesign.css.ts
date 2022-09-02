import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const layout = style({});

globalStyle('body .ant-layout-header', {
  backgroundColor: vars.colors.white
});
