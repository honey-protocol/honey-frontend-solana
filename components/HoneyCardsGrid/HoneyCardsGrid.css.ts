import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const honeyCardsGrid = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
});

export const gridFilters = style({
  marginBottom: 40,
  display: 'flex'
});

export const gridContent = style({
  display: 'flex',
  flexDirection: 'column'
});

export const cardsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridGap: '40px 12px'
});

export const searchInputWrapper = style({
  background: vars.colors.grayMiddle,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  margin: '0 4px'
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
