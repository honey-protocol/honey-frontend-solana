import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';
import { container } from '../../styles/common.css';

export const layout = style({
  minHeight: '100vh',
  padding: '12px 0'
});

// globalStyle(`body ${layout} .ant-layout-header`, {
//   backgroundColor: vars.colors.white
// });

globalStyle(`body ${layout} .ant-layout-sider`, {
  backgroundColor: 'transparent'
});

export const layoutHeader = style({
  height: 'unset',
  padding: 0,
  backgroundColor: 'transparent',
  zIndex: '1'
});

export const contentContainer = style([container, {}]);

globalStyle(`body ${contentContainer} > .ant-layout-content`, {
  backgroundColor: 'transparent',
  paddingRight: 24
});
