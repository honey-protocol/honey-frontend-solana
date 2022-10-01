import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const createProposalTab = style({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: vars.colors.white,
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

export const col = style({
  flex: '100% 0 0'
});

export const tabTitle = style([typography.title, {
  color: vars.colors.black,
  marginBottom: 12
}])

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

export const titleInput = style({
  marginBottom: 12,
  minHeight: 72
})

export const descriptionInput = style({
  marginBottom: 12,
  minHeight: 152
})

export const discussionInput = style({
  height: 52
})
