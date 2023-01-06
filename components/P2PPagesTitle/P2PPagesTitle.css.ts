import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';
import { ArrowLeftGrayIcon } from '../../styles/icons.css';

export const pagesTitle = style({
  display: 'flex',
  alignItems: 'center'
});

export const iconPrev = style([
  ArrowLeftGrayIcon,
  {
    width: 20,
    height: 20,
    marginRight: 8
  }
]);

export const prevPage = style([
  typography.description,
  {
    marginBottom: 16,
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer'
  }
]);
globalStyle(`.ant-typography${prevPage}`, {
  color: vars.colors.textTertiary
});

export const name = style([
  typography.pageTitle,
  {
    marginBottom: 0
  }
]);

export const img = style({
  width: 46,
  height: 46,
  marginRight: 16
});
