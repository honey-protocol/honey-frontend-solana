import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const howItWorksTab = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
  justifyContent: 'space-between'
});

export const contentWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 24
});

export const listItem = style([
  typography.description,
  {
    color: vars.colors.text,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 12
  }
]);

export const listIcon = style({
  width: 36,
  height: 36,
  flexShrink: 0,
  marginRight: 18
});

export const listIconNumber = style([
  typography.body,
  {
    background: 'white',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: vars.colors.black
  }
]);

export const divider = style({
  backgroundImage: `linear-gradient(to right, ${vars.colors.text} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px',
  height: 1,
  width: '100%',
  marginBottom: 16
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

export const toggle = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 28
});

export const toggleText = style([
  typography.button,
  {
    color: vars.colors.text,
    marginLeft: 8
  }
]);

export const listLink = style([
  typography.description,
  {
    color: `${vars.colors.brownMiddle}!important`
  }
]);

export const listText = style([typography.description]);
