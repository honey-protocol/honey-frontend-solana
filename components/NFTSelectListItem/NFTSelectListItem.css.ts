import { style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const list = style({
  display: 'flex',
  flexDirection: 'column'
});

export const listItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '14px 0',
  alignItems: 'center'
});

export const listItemLeft = style({
  display: 'flex'
});
export const listItemIcon = style({
  width: 34,
  height: 34,
  flexShrink: 0,
  marginRight: 15
});
export const itemCollectionName = style([
  typography.caption,
  {
    marginTop: 12,
    color: vars.colors.text,
    fontSize: 16
  }
]);

