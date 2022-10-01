import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const depositForm = style({
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

export const divider = style({
  backgroundImage: `linear-gradient(to right, ${vars.colors.black} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px',
  height: 2,
  width: '100%',
  marginBottom: 16
});
