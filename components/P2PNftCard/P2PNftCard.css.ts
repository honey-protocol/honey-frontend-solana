import { style, styleVariants } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const nftCard = style({
  maxWidth: 272,
  border: `2px solid ${vars.colors.grayDark}`,
  boxShadow: `4px 4px 0px ${vars.colors.grayDark}`,
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.2s',
  ':hover': {
    borderColor: vars.colors.borderPrimary,
    boxShadow: `4px 4px 0px ${vars.colors.brownLight}`
  },
  cursor: 'pointer'
});

export const isActive = style({
  borderColor: vars.colors.borderPrimary,
  boxShadow: `4px 4px 0px ${vars.colors.brownLight}`
});

export const values = style({
  display: 'flex',
  justifyContent: 'space-between'
});

export const info = style({
  padding: '30px 8px 16px',
  position: 'relative',
  background: vars.colors.foreground
});

export const statusBlock = style({
  position: 'absolute',
  top: '-15px',
  left: '50%',
  transform: 'translateX(-50%)'
});

export const name = style([
  typography.title,
  {
    marginBottom: 16,
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    textAlign: 'center'
  }
]);

export const img = style({
  width: '100%',
  height: 201,
  position: 'relative',
  overflow: 'hidden'
});
