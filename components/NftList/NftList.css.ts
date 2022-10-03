import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const nftsListContainer = style({});

export const listItem = style({
  paddingTop: 14
  // border: '1px solid'
});

export const selectedListItem = style({
  border: `2px solid ${vars.colors.brownMiddle}`,
  borderRadius: '10px'
});
