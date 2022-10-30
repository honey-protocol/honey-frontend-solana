import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';
import { trashIcon } from '../../styles/icons.css';

export const liquidationList = style({
  padding: '0 16px',
  marginBottom: 12,
  borderRadius: 12,
  backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
  backgroundSize: '1px 100%, 100% 1px, 1px 100%, 100% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundImage: `repeating-linear-gradient(0deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(90deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(180deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(270deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px)`,
  borderImage: `repeating-linear-gradient(0deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px)`
});

export const liquidationItem = style({
  padding: '12px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundImage: `linear-gradient(to right, ${vars.colors.grayDark} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px'
});

export const liquidationItemText = style([
  typography.description,
  {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingRight: 5
  }
]);

export const liquidationDelete = style([
  trashIcon,
  {
    width: 20,
    height: 20,
    cursor: 'pointer',
    flexShrink: 0
  }
]);

globalStyle(`${liquidationItem}:last-child`, {
  backgroundImage: 'initial'
});

export const liquidationInputBlock = style({
  position: 'relative',
  marginBottom: 12
});

export const liquidationButton = style({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: 16,
  opacity: 0,
  pointerEvents: 'none',
  transition: 'all 0.3s'
});

export const show = style({
  opacity: 1,
  pointerEvents: 'all'
});

export const liquidationInput = style([
  typography.body,
  {
    paddingRight: 65,
    color: vars.colors.black,
    background: vars.colors.white,
    border: `1px solid ${vars.colors.grayDark}`,
    borderRadius: '12px!important',
    height: 52,
    ':hover': {
      border: `1px solid ${vars.colors.grayDark}`
    },
    ':focus': {
      boxShadow: 'none',
      border: `1px solid ${vars.colors.grayDark}`
    },
    '::placeholder': {
      color: vars.colors.grayTransparent
    }
  }
]);

export const SectionTitle = style({
  marginBottom: 16
});
