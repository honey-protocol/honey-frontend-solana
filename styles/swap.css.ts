import { style, globalStyle } from '@vanilla-extract/css';
import { typography, vars } from './theme.css';
import { questionIcon, swapIcon } from './icons.css';

export const pageContent = style({
  maxWidth: '398px',
  margin: 'auto'
});

export const pageTitle = style([
  typography.pageTitle,
  {
    marginTop: '12px',
    marginBottom: '24px',
    textAlign: 'center'
  }
]);

export const sectionTitle = style([{ marginBottom: '16px' }]);

export const section = style({
  marginBottom: 36
});

export const swapFormContainer = style({
  background: `${vars.colors.foreground}`,
  padding: `24px 24px 12px 24px`
});

export const inputs = style({
  marginBottom: 36
});

export const tokenInputWrapper = style({
  position: 'relative'
});

export const tokenSelector = style({
  position: 'absolute',
  top: 2,
  bottom: 2,
  right: 2,
  paddingLeft: 10,
  paddingRight: 10 + 12,
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: 10,
  selectors: {
    '&:hover, &:active': { background: vars.colors.grayLight }
  }
});

export const tokenName = style([typography.body, { lineHeight: 'initial' }]);

export const tokenLogo = style([
  {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: '100%'
  }
]);

export const inputStats = style({
  marginTop: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export const balance = style([
  typography.caption,
  {
    color: vars.colors.textSecondary,
    opacity: 0.4
  }
]);

export const halfMaxButtons = style({
  display: 'flex',
  alignItems: 'center'
});
export const tinyButton = style([
  typography.caption,
  {
    textTransform: 'lowercase',
    padding: '5px 12px'
  }
]);

export const slippageSettings = style({
  marginBottom: 20
});

export const swapStats = style({
  marginBottom: 28
});

export const buttons = style({
  margin: `0 -12px`
});

globalStyle(`${buttons} .ant-tooltip-open`, {
  display: 'block'
});

export const reloadIcon = style({
  background: 'url("/images/reload-icon.svg") center center no-repeat',
  width: 15,
  height: 15,
  marginLeft: 4,
  transform: 'translateY(-2px)',
  cursor: 'pointer'
});

export const swapArrow = style({
  display: 'flex',
  justifyContent: 'center',
  margin: `16px 0`
});

export const swapArrowIcon = style([
  swapIcon,
  {
    width: 36,
    height: 36,
    borderRadius: 36,
    selectors: {
      '&:hover, &:active': { backgroundColor: vars.colors.grayLight }
    }
  }
]);
