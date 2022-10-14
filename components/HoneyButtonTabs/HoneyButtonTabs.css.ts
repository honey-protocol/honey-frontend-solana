import {style, styleVariants} from "@vanilla-extract/css";
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const periodSelector = style({
  display: 'flex',
  justifyContent: 'flex-start',
  "@media": {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      justifyContent: 'center',
    },
  },
});
export const fullWidthSelector = style({
  width: '100%'
})

export const periodSelectorContent = style({
  display: 'flex',
  background: vars.colors.grayMiddle,
  borderRadius: 10,
  padding: 2,
  width: '100%',

});

export const periodSelectorContentResponsibility = style({
  "@media": {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      width: 'auto',
    },
  },
})

const periodSelectorItemBase = style([
  typography.button,
  {
    padding: '6px 12px',
    cursor: 'pointer',
    position: 'relative',
    width: '100%',
    textAlign: "center",
    whiteSpace: "nowrap"
  }
]);
export const verticalDivider = style({
  position: 'absolute',
  width: 2,
  height: 20,
  background: 'url("/images/vertical-divider.svg") center no-repeat',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)'
});

export const hideNameMobile = style({
  display: 'none',
  "@media": {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'block',
    },
  },
});

export const hideNameTablet = style({
  display: 'none',
  "@media": {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      display: 'block',
    },
  },
});

export const showNameMobile = style({
  "@media": {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'none',
    },
  },
});

export const showNameTablet = style({
  "@media": {
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      display: 'none',
    },
  },
});

export const periodSelectorItem = styleVariants({
  active: [
    periodSelectorItemBase,
    {
      borderRadius: 8,
      background: vars.colors.white
    }
  ],
  passive: [periodSelectorItemBase, {}]
});