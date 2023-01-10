import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const depositForm = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: 16
});

export const voted = style([
  typography.body,
  {
    padding: '16px 16px 14px'
  }
]);

export const votedGreen = style({
  color: vars.colors.green
});

const formSection = style([
  {
    marginBottom: '24px'
  }
]);

export const row = style([
  formSection,
  {
    display: 'flex',
    alignItems: 'center'
  }
]);

export const col = style({
  flex: '100% 0 0'
});

export const statusCol = style({
  paddingRight: 20
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)'
});

export const gridCell = style({
  display: 'flex',
  flexDirection: 'column',
  marginRight: 16,
  marginBottom: 24
});

export const span2Cell = style({
  gridColumnStart: 'span 2'
});

export const votingPowerInfo = style({
  background: vars.colors.grayLight,
  borderRadius: 12,
  padding: '8px 16px'
});

export const buttons = style([
  {
    display: 'flex'
  }
]);

export const smallCol = style([
  {
    flex: '0 0 auto',
    marginRight: '12px'
  }
]);

export const bigCol = style([
  {
    flex: '1 0 auto'
  }
]);

export const title = style([typography.title]);
export const body = style([typography.body]);
export const description = style([typography.description]);
export const highlight = style({});

export const divider = style({
  backgroundImage: `linear-gradient(to right, ${vars.colors.black} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px',
  height: 1,
  minHeight: 1,
  width: '100%',
  marginBottom: 16
});

export const iconContainer = style([
  {
    minWidth: 46,
    height: 46
  }
]);

export const hasVoteContainer = style([
  typography.description,
  {
    width: '100%',
    background: vars.colors.white,
    height: 52,
    border: `2px solid ${vars.colors.black}`,
    borderRadius: 12,
    padding: 16,
    boxShadow: `2px 2px 0px 0px ${vars.colors.black}`
  }
]);
