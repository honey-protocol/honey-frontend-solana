import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';
import { filterIcon } from '../../styles/icons.css';

export const filterBtn = style({
  height: 36,
  background: vars.colors.grayMiddle,
  border: `2px solid ${vars.colors.grayMiddle}`,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px 0 10px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    borderColor: vars.colors.black,
    background: vars.colors.white,
    boxShadow: `2px 2px 0px ${vars.colors.brownLight}`
  }
});

export const open = style({
  borderColor: vars.colors.black,
  background: vars.colors.white,
  boxShadow: `2px 2px 0px ${vars.colors.brownLight}`
});

export const textBtn = style([ typography.button ]);

export const filter = style([
  filterIcon,
  {
    width: 20,
    height: 20,
    marginRight: 10
  }
]);

