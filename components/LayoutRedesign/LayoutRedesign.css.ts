import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const layout = style({
  padding: 20,
  minHeight: '100vh'
});

globalStyle('body .ant-layout-header', {
  backgroundColor: vars.colors.white
});

export const layoutHeader = style({
  height: 'unset',
  position: 'relative',
  borderRadius: vars.space.medium,
  border: '2px solid black',
  boxShadow: '4px 4px 0px 0px rgba(231, 180, 0, 1)',

  zIndex: '1'
  // '::after': {
  //   content: '',
  //   zIndex: '0',
  //   position: 'absolute',
  //   height: '100%',
  //   width: '100%',
  //   top: '0',
  //   left: '0',
  //   backgroundColor: 'red',
  //   borderRadius: vars.space.medium,

  // }
});
