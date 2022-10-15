import { style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const dropdown = style([
  typography.body,
  {
    width: '100%',
    position: 'relative',
    borderRadius: 12,
    border: `2px solid ${vars.colors.grayDark}`,
    cursor: 'pointer'
  }
]);

export const dropdownActive = style({
  borderColor: vars.colors.brownLight
});

export const dropdownFilterSelected = style({
  padding: '15px 20px'
});

export const dropdownSelect = style({
  position: 'absolute',
  left: '0',
  top: 'calc(100% + 5px)',
  width: '100%',
  listStyle: 'none',
  background: vars.colors.white,
  borderRadius: 12,
  border: `2px solid ${vars.colors.grayDark}`,
  margin: '0',
  padding: '0',
  borderWidth: '2px',
  overflow: 'hidden',
  transitionDuration: '0.5s',
  cursor: 'pointer',
  zIndex: 10
});

export const dropdownSelectOption = style({
  padding: '12px 20px',
  cursor: 'pointer',
  borderBottom: '1.5px solid',
  borderBottomColor: vars.colors.grayMiddle,
  transitionDuration: '.5s',
  ':last-child': {
    borderBottomWidth: 0
  },
  ':hover': {
    background: vars.colors.grayLight
  }
});
