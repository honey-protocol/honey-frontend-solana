import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const nftsListContainer = style({});

export const listItem = style({
  marginBottom: 14
});

export const selectedListItem = style({
  borderTop: `1px solid ${vars.colors.brownMiddle}`,
  borderBottom: `1px solid ${vars.colors.brownMiddle}`
});
