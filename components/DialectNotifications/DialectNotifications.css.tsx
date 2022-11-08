import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const dialectNotification = style({});

const popoverSelector = `${dialectNotification} .dialect .dialect > .dt-fixed`;

globalStyle(`${popoverSelector}`, {});

globalStyle(`${popoverSelector} .dt-flex-row`, {
  padding: '16px 16px 16px 16px',
  border: 'none',
  maxHeight: 'initial',
  minHeight: 0,
  marginBottom: `-16px`
});

globalStyle(`${popoverSelector} .dt-flex-row > .dt-text-base`, {
  ...typography.title
});

globalStyle(`${popoverSelector} .dialect > .dt-flex > .dt-h-full`, {});
