import { style, globalStyle } from '@vanilla-extract/css';
import { container } from '../../styles/common.css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

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
  // background: vars.colors.background,
  zIndex: '3',
  position: 'fixed',
  top: 0,
  left: 0
});

export const contentContainer = style({
  background: vars.colors.background,
  paddingTop: 100
});

export const contentCenter = style([container]);

globalStyle(`body ${contentContainer} > .ant-layout-content`, {
  backgroundColor: 'transparent',
  display: 'flex'
});

export const alertBox = style([
  container,
  {
    height: 50,
    position: 'fixed',
    top: 75,
    left: 0,
    right: 0,
    zIndex: 2,
    width: '100%',
    margin: '0 auto',
    color: vars.colors.black,
    paddingRight: 8,
    '@media': {
      [`screen and (max-width: ${breakpoints.mobile}px)`]: {
        paddingRight: 10,
        display: 'none'
      }
    }
  }
]);

export const alertContent = style([
  typography.description,
  {
    background: vars.colors.brownLight,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 5,
    borderRadius: '0 0 10px 10px'
  }
]);
