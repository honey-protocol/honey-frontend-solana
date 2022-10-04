import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const cardContainer = style({
  transition: 'all .3s',
  boxSizing: 'border-box',
  borderWidth: 2,
  borderColor: 'black',
  ':hover': {
    borderColor: vars.colors.brownLight,
    borderWidth: 3
  }
});

export const cardTitle = style({
  WebkitLineClamp: 1,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});
