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

globalStyle(`${notificationCard}:last-child:after`, {
  position: 'absolute',
  content: '',
  bottom: '-8px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 32px)',
  height: 40,
  borderRadius: 16,
  background: vars.colors.white,
  zIndex: '-1'
});

globalStyle(`${notificationCard}:last-child:before`, {
  position: 'absolute',
  content: '',
  bottom: '0',
  left: 0,
  width: '100%',
  height: '100%',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.04)',
  zIndex: 1,
  pointerEvents: 'none',
  borderRadius: 16
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

export const notificationDescription = style( {
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
    textOverflow: 'ellipsis'
  }
]);

export const notificationShow = style([
  typography.description,
  {
    color: vars.colors.black
  }
]);
