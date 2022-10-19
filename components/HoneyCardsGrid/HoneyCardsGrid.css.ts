import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';
import { pageTitle as pageTitleCommon } from '../../styles/common.css';

export const honeyCardsGrid = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
});

export const gridFilters = style({
  marginBottom: 40,
  display: 'flex',
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      flexWrap: 'wrap',
    },
  },
});

export const hideMobile = style({
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      display: 'none',
    },
  },
});

export const showMobile = style({
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'none'
    },
  },
});

export const pageTitle = style([
  pageTitleCommon,
  {
    '@media': {
      [`screen and (min-width: ${breakpoints.tablet}px)`]: {
        marginBottom: '12px!important'
      },
    },
  }
]);

export const mobilePageTitle = style({
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
  },
});

export const gridContent = style({
  display: 'flex',
  flexDirection: 'column'
});

export const cardsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gridGap: '40px 12px',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    }
  },
});

export const searchInputWrapper = style({
  background: vars.colors.grayMiddle,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: 36,
  marginBottom: 8,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      margin: '0 4px',
    },
  },
});

globalStyle(`${searchInputWrapper} input::placeholder`, {
  color: vars.colors.black
});

export const cardsDivider = style({
  display: 'flex',
  alignItems: 'center',
  marginTop: 18,
  marginBottom: 50
});

export const dividerText = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    margin: '0 16px',
    whiteSpace: 'nowrap'
  }
]);

export const divider = style({
  backgroundImage: `linear-gradient(to right, ${vars.colors.grayDark} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px',
  height: 1,
  width: '100%'
});
