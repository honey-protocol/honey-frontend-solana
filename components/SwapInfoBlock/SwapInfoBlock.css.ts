import { typography, vars } from '../../styles/theme.css';
import { style } from '@vanilla-extract/css';

export const swapInfoBlock = style({
  display: 'flex',
  width: '100%'
});

export const borderInfoBlock = style({
  backgroundImage: `linear-gradient(to right, ${vars.colors.borderPrimary} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px',
  width: '100%',
  height: 2,
  marginBottom: 16
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
