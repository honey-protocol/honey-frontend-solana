import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const dialectNotification = style({
  width: 195,
  height: 20
});

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

globalStyle(`${popoverSelector} .dt-bg-white`, {
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`,
  border: `2px solid ${vars.colors.black}`
});

globalStyle(`${dialectNotification} .dialec > div`, {
  position: 'static'
});
