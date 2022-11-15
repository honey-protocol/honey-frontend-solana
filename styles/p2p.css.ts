import { style } from '@vanilla-extract/css';
import { breakpoints, vars } from './theme.css';

export const gridFilters = style({
  marginBottom: 40,
  display: 'flex',
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      flexWrap: 'wrap'
    }
  }
});

export const cardsContainer = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 12
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
      margin: '0 4px'
    }
  }
});

export const cardsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gridGap: '40px 12px',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    [`screen and (min-width: ${breakpoints.desktop}px)`]: {
      gridTemplateColumns: 'repeat(3, 1fr)'
    }
  }
});

export const footer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
});
