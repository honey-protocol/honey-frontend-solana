import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const tabs = style({});

export const content = style({
  borderRadius: vars.space.medium,
  background: vars.colors.white,
  height: 'calc(100vh - 155px)',
  borderTop: 'none !important'
});

export const inactive = style({
  boxShadow: `2px 2px 0px 0px ${vars.colors.grayDark}`,
  border: `2px solid ${vars.colors.grayDark}`
});
export const active = style({
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`,
  border: `2px solid ${vars.colors.black}`,
  zIndex: '10'
});

export const tabSvg = style({
  width: '100%',
  position: 'absolute',
  bottom: '-13.5px',
  display: 'flex',
  zIndex: '10'
});

globalStyle(`${tabSvg} svg`, {
  width: '100%'
});

export const svgRight = style({
  width: 'calc(100% + 4px)',
  bottom: '-16px'
});

export const tabsNav = style({
  display: 'flex',
  position: 'relative',
  height: '40px'
});

export const tab = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
  cursor: 'pointer',
  zIndex: 20
});

export const tabText = style([
  typography.button,
  {
    marginTop: '7px'
  }
]);

export const tabBottomCover = style({
  position: 'absolute',
  width: '100%',
  height: '7px',
  borderRight: '2px solid',
  borderLeft: '2px solid',
  borderColor: vars.colors.black,
  zIndex: 10,
  bottom: '-16px',
  left: '0',
  background: vars.colors.white
});

export const tabBottomCoverInactive = style({
  borderColor: vars.colors.grayDark
});
