import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const positionCard = style({
  background: vars.colors.white,
  padding: 12,
  paddingTop: 34,
  borderRadius: 12,
  border: `2px solid ${vars.colors.grayDark}`,
  boxShadow: `2px 2px 0px ${vars.colors.grayDark}`,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',

  selectors: {
    '&:hover': {
      border: `2px solid ${vars.colors.brownLight}`,
      boxShadow: `2px 2px 0px ${vars.colors.brownLight}`
    }
  }
});

export const activeCard = style({
  border: `2px solid ${vars.colors.black} !important`,
  boxShadow: `2px 2px 0px ${vars.colors.brownLight}`
});

export const collectionIcon = style({
  position: 'absolute',
  left: 'calc(50% - 46px/2)',
  top: -27,
  width: 46,
  height: 46
});

export const positionName = style({
  display: 'flex',
  justifyContent: 'center'
});

export const nameText = style([
  typography.title,
  {
    color: vars.colors.black,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 153,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
]);

export const arrowIcon = style({
  width: 20,
  height: 20,
  background: 'url("/images/arrow-right-black.svg") bottom no-repeat'
});

export const positionValues = style({
  display: 'flex',
  justifyContent: 'space-between'
});

export const divider = style({
  backgroundImage: `linear-gradient(to right, ${vars.colors.grayDark} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px',
  height: 1,
  width: '100%',
  marginBottom: 8,
  marginTop: 16
});
