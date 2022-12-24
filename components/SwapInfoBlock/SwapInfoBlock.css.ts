import { typography, vars } from '../../styles/theme.css';
import { style } from '@vanilla-extract/css';

export const swapInfoBlock = style({
  display: 'flex',
  width: '100%'
});

export const borderInfoBlock = style({
  background: 'url("/images/swap-info-block-line.svg") center center',
  width: '100%',
  height: 2,
  marginBottom: 14
});

export const infoBlockWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

export const infoBlockRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 14,
  selectors: {
    '&:last-child': { marginBottom: '0px' }
  }
});

export const infoBlockTitle = style([
  typography.caption,
  {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: vars.colors.textTertiary
  }
]);

export const infoBlockValue = style([typography.body]);

export const titleAddon = style({
  display: 'flex'
});
