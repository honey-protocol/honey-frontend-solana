import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const values = style({
  display: 'flex',
  justifyContent: 'space-between'
});

export const info = style({
  padding: '30px 8px 16px',
  position: 'relative',
  background: vars.colors.white
});

export const statusBlock = style({
  width: '100%',
  position: 'absolute',
  top: '-15px',
  left: '50%',
  transform: 'translateX(-50%)',
  textAlign: 'center'
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

export const collectionCard = style({
  maxWidth: 272,
  border: `2px solid ${vars.colors.grayDark}`,
  boxShadow: `2px 2px 0px ${vars.colors.grayDark}`,
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.2s',
  ':hover': {
    borderColor: vars.colors.black,
    boxShadow: `2px 2px 0px ${vars.colors.brownLight}`,
  },
});

export const isActive = style({
  borderColor: vars.colors.black,
  boxShadow: `2px 2px 0px ${vars.colors.brownLight}`,
});

export const icon = style({
  width: 46,
  height: 46,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
});

export const blur = style({
  width: '100%',
  height: 94,
  position: 'relative',
  overflow: 'hidden',
});

export const iconBlur = style({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflow: 'hidden',
  filter: 'blur(18px)'
});
