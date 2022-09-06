import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const borrowForm = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 756,
  background: vars.colors.white,
  padding: 16
});

// margin-bottom: auto and margin-top: auto uses all available space
// and stick footer to the bottom of the parent container
export const content = style({
  marginBottom: 'auto'
});

export const footer = style({
  marginTop: 'auto'
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

export const nftInfo = style([
  formSection,
  row,
  {
    alignItems: 'center'
  }
]);
export const nftImage = style([
  formSection,
  {
    width: 46,
    height: 46,
    marginRight: 15
  }
]);
export const nftName = style([formSection, typography.title, {}]);

export const inputs = style([
  {
    paddingTop: 16,
    backgroundImage: `linear-gradient(to right, ${vars.colors.black} 50%, transparent 50%)`,
    backgroundPosition: 'left top, left bottom, left top, right top',
    backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
    backgroundSize: '20px 2px, 20px 2px, 2px 20px, 2px 20px',
    marginBottom: 16
  }
]);

export const buttons = style([{}]);
