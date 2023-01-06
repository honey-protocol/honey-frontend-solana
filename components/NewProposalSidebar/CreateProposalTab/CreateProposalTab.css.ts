import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const createProposalTab = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: 16
});

const formSection = style([
  {
    marginBottom: '24px'
  }
]);

export const row = style([
  formSection,
  {
    display: 'flex'
  }
]);
export const mb12 = style({
  marginBottom: 12
});

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

export const titleInput = style([
  mb12,
  {
    marginBottom: 12,
    minHeight: 72
  }
]);

export const descriptionInput = style([
  mb12,
  {
    marginBottom: 12,
    minHeight: 152
  }
]);

export const singleLineInput = style({
  height: 52
});

export const discussionInput = style([
  formSection,
  singleLineInput,
  {
    width: '100%'
  }
]);
