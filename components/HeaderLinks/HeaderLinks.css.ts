import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const container = style({
  display: 'flex',
  padding: '0',
  margin: '0',
  listStyle: 'none',
  gap: '24px',
  borderRight: 0,
  '@media': {
    [`screen and (max-width: ${breakpoints.tablet}px)`]: {
      display: 'none'
    }
  }
});

export const submenu = style([
  typography.button,
  {
    color: vars.colors.grayTransparent,
    textTransform: 'uppercase',
    background: 'transparent!important'
  }
]);

globalStyle(`.ant-menu-submenu${submenu} .ant-menu-submenu-title .ant-menu-title-content`, {
  color: vars.colors.grayTransparent,
  gap: 8,
  display: 'flex',
  alignItems: 'center'
});

globalStyle(`.ant-menu-submenu${submenu} .ant-menu-submenu-title .ant-menu-title-content svg path`, {
  fill: vars.colors.grayTransparent,
  transition: 'all .5s'
});

globalStyle(`.ant-menu-submenu${submenu} .ant-menu-submenu-title:hover .ant-menu-title-content`, {
  color: vars.colors.black,
});

globalStyle(`.ant-menu-submenu${submenu} .ant-menu-submenu-title:hover .ant-menu-title-content svg path`, {
  fill: vars.colors.black,
});

globalStyle(`.ant-menu-submenu${submenu} .ant-menu-submenu-title`, {
  padding: 0,
});

export const item = style([typography.button]);
export const subItem = style({});

globalStyle(`.ant-menu-item${item}`, {
  padding: '0',
  margin: '0',
  height: '30px',
  lineHeight: '16px',
  background: 'transparent!important',
});

globalStyle(`.ant-menu-item${subItem}`, {
  padding: '0 10px',
});

globalStyle(`.ant-menu-item${subItem} .ant-btn`, {
  justifyContent: 'flex-start'
});

globalStyle(`.ant-menu-vertical .ant-menu-item${item}:not(:last-child)`, {
  margin: '0',
});

globalStyle(`.ant-menu-item${item} a:hover`, {
  color: `${vars.colors.black}`
});

globalStyle(`.ant-menu-item${item} .ant-menu-submenu-arrow`, {
  display: 'none'
});

globalStyle(`${container} li`, {
  display: 'flex',
  alignItems: 'center'
});

globalStyle(`${container} li`, {
  display: 'flex',
  alignItems: 'center'
});

export const title = style({
  ...typography.body,
  margin: '0 !important'
});

export const activeLink = style({});
globalStyle(`.ant-menu-item${activeLink} a.ant-btn`, {
  opacity: 1
});
