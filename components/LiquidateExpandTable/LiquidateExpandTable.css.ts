import { style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const expandTableHeader = style({
  paddingLeft: 16,
  paddingRight: 24,
  marginTop: 12,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const positionsCounterContainer = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 4,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      marginBottom: 0
    }
  }
});

export const positionsCounterTitle = style([typography.title]);

export const positionsCount = style([
  typography.numbersRegular,
  {
    padding: '3px 4px',
    borderRadius: 8,
    background: vars.colors.grayMiddle,
    marginLeft: 8
  }
]);

export const positionsCounterTitleMobile = style([
  typography.title,
  { fontSize: '15px' }
]);

export const doubleContainerWrapper = style({
  background: 'red',
  zIndex: '100',
  width: '10em'
})

export const doubleContainerItem = style({
  background: 'blue'
})

export const logoWrapper = style({
	marginRight: 12,
	display: 'flex'
});
export const collectionLogo = style({
	width: '34px',
	height: '34px',
	minWidth: '34px',
	flexShrink: 0,
	zIndex: 1
});

export const secondaryLogo = style({
	marginLeft: -15,
	zIndex: 0
});
