import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const tabs = style({
  height: '100%'
});

export const content = style({
  borderRadius: '0 0 15px 15px',
  background: vars.colors.white,
  height: '100%',
  overflow: 'hidden'
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

export const activeBorderLeft = style({
  borderRadius: '0 15px 15px 15px'
});

export const activeBorderRight = style({
  borderRadius: '15px 0 15px 15px'
});

export const tabSvg = style({
  width: '100%',
  position: 'absolute',
  bottom: '-13.5px',
  display: 'flex',
  zIndex: '10'
});

globalStyle(`${tabSvg} svg`, {});

export const svgRight = style({
  width: '50%',
  height: 40,
  bottom: '0',
  right: 0,
  ':after': {
    content: '',
    position: 'absolute',
    right: -4,
    bottom: -5,
    width: 4,
    height: 4,
    background: vars.colors.brownLight,
    borderRadius: '0 5px 5px 0'
  }
});

export const svgLeft = style({
  width: '50%',
  bottom: '-2px',
  left: 0
});

export const svgBorderRight = style({
  position: 'absolute',
  top: 0,
  right: -4
});

export const svgBorder = style({
  position: 'absolute',
  top: 0,
  right: -10
});

export const svgBorderLeft = style({
  position: 'absolute',
  top: 0,
  left: -12
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
  zIndex: 20,
  position: 'relative',
  ':after': {
    content: '',
    position: 'absolute',
    left: '50%',
    top: 0,
    transform: 'translateX(-50%)',
    width: 'calc(100% - 36px)',
    height: 'calc(100% + 2px)',
    background: vars.colors.white,
    zIndex: -1,
    opacity: 0,
    borderTop: `2px solid ${vars.colors.black}`
  }
});

export const disabled = style({
  cursor: 'not-allowed'
});

export const activeText = style({
  opacity: 1,
  ':after': {
    opacity: 1
  }
});

export const inactiveText = style({
  opacity: 0.4,
  ':after': {
    opacity: 0
  }
});

export const tabText = style([typography.button]);

export const tabBottomCoverInactive = style({
  borderColor: vars.colors.grayDark
});
