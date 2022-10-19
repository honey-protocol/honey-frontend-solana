import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const notificationCard = style({
  padding: '10px 16px',
  background: vars.colors.white,
  borderRadius: 16,
  marginBottom: 4,
  position: 'relative',
  cursor: 'pointer',
  zIndex: 1
});

export const important = style({
  width: 8,
  height: 8,
  background: vars.colors.brownLight,
  borderRadius: '50%',
  position: 'absolute',
  top: 16,
  right: 16
});

export const notificationTitle = style([
  typography.body,
  {
    color: vars.colors.black,
    marginBottom: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: 10
  }
]);

export const notificationDescription = style({
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
});

export const notificationText = style([
  typography.description,
  {
    color: vars.colors.grayTransparent,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: 0
  }
]);

export const notificationShow = style([
  typography.description,
  {
    color: vars.colors.black
  }
]);
