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
export const itemCollection = style({
  display: 'flex',
  flexDirection: 'column'
});
export const itemCollectionName = style([
  typography.caption,
  {
    marginBottom: 2,
    color: vars.colors.text,
    fontSize: 16
  }
]);
export const itemCollectionValue = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: 12
});
export const itemCollectionValueCount = style([
  typography.numbersRegular,
  {
    color: vars.colors.text,
    marginRight: 4,
    marginLeft: 4,
    fontSize: 14
  }
]);
export const itemCollectionToken = style([
  typography.caption,
  {
    color: vars.colors.text
  }
]);
