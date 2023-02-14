import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const warning = style({
  backgroundColor: vars.colors.secondaryBrownLight,
  borderRadius: 12,
  padding: '12px 12px 10px',
  width: '100%'
});

export const warningDanger = style({
  backgroundColor: 'transparent',
  position: 'relative',
  overflow: 'hidden',
  ':before': {
    content: '',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: vars.colors.red,
    opacity: 0.13
  }
});

export const warningTitle = style([
  typography.description,
  {
    color: vars.colors.brownMiddle
  }
]);

globalStyle(`.ant-typography ${warningTitle}`, {
  marginBottom: 0
});

export const warningDangerTitle = style({
  color: vars.colors.redDark,
  position: 'relative'
});

export const warningLink = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const warningLinkIcon = style({
  width: 20,
  height: 20,
  background: 'no-repeat center/contain url("/images/newPageBig.svg")',
  flexShrink: 0,
  marginLeft: 8
});
