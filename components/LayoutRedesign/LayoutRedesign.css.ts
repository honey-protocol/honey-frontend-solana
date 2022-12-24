import { style, globalStyle } from '@vanilla-extract/css';
import { container } from '../../styles/common.css';
import { breakpoints, vars } from '../../styles/theme.css';

export const layout = style({
  minHeight: '100vh',
  background: vars.colors.background
});

globalStyle(`body ${layout} .ant-layout-sider`, {
  backgroundColor: 'transparent'
});

globalStyle(`.disable-scroll`, {
  overflow: 'hidden',
  '@media': {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      overflow: 'initial'
    }
  }
});

globalStyle(`body`, {
  background: vars.colors.grayLight
});

export const layoutHeader = style({
  height: 'unset',
  width: '100%',
  padding: '12px 0 0 0',
  background: vars.colors.background,
  zIndex: '2',
  position: 'fixed',
  top: 0,
  left: 0
});

export const contentContainer = style({
  background: vars.colors.background,
  paddingTop: 90
});

export const contentCenter = style([container]);

globalStyle(`body ${contentContainer} > .ant-layout-content`, {
  backgroundColor: 'transparent',
  display: 'flex'
});
