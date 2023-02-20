import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const burnNftsForm = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: vars.colors.white,
  padding: 16
});

export const articleWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 12
});

export const articleTitle = style([
  typography.title,
  {
    color: vars.colors.text,
    marginBottom: 2
  }
]);

export const articleDescription = style([
  typography.description,
  {
    color: vars.colors.textTertiary
  }
]);

const formSection = style([
  {
    marginBottom: '10px'
  }
]);

export const row = style([
  formSection,
  {
    display: 'flex'
  }
]);

export const col = style({
  flex: '100% 0 0'
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

export const list = style({
  display: 'flex',
  flexDirection: 'column'
});
