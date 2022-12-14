import { style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const honeySearchTokenModal = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: 12
});

export const title = style([
  typography.title,
  {
    width: '100%',
    textAlign: 'center'
  }
]);

export const inputWrapper = style([
  typography.body,
  {
    display: 'flex',
    width: '100%',
    margin: '24px 0 24px 0',
    flexDirection: 'column'
  }
]);

export const featuredTokens = style({
  display: 'flex',
  marginBottom: `18px`,
  flexWrap: 'wrap'
});

export const featuredToken = style([
  typography.button,
  {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    position: 'relative',
    background: vars.colors.grayMiddle,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    marginRight: `6px`,
    marginBottom: 6,
    cursor: 'pointer',
    borderRadius: 10,
    selectors: {
      '&:hover': {
        background: vars.colors.grayDark
      }
    }
  }
]);

export const featuredTokenLogo = style([
  {
    display: 'flex',
    width: 14,
    height: 14,
    marginRight: 6,
    borderRadius: '100%'
  }
]);

export const tokenInfoWrapper = style({
  display: 'flex',
  justifyContent: 'flex-start',
  width: '99%',
  padding: '7px 16px',
  cursor: 'pointer',
  zIndex: 2,
  // border: `2px solid ${vars.colors.grayDark}`,
  borderRadius: 12,
  selectors: {
    '&:hover': {
      background: `${vars.colors.grayMiddle}`
    }
  }
});

export const tokenInfo = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start'
});

export const tokenTitle = style([
  typography.description,
  {
    textAlign: 'left'
  }
]);

export const tokenLogo = style({
  display: 'flex',
  width: 28,
  height: 28,
  marginRight: 12,
  marginTop: 2,
  borderRadius: '100%'
});

export const tokenDescription = style([
  typography.numbersMini,
  {
    display: 'flex'
  }
]);

export const tokensList = style({
  selectors: {
    '&::-webkit-scrollbar': {
      width: 10
    },
    '&::-webkit-scrollbar-track': {
      display: 'none'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 12,
      background: vars.colors.grayDark
    }
  }
});

export const middot = style({
  display: 'flex',
  width: 5,
  height: 5,
  backgroundColor: vars.colors.grayDark,
  borderRadius: '50%',
  margin: '4px 8px'
});
