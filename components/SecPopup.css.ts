import { style } from '@vanilla-extract/css';
import { typography, vars } from '../styles/theme.css';
import { logoIcon } from '../styles/icons.css';

export const secPopup = style({
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
  flexDirection: 'column',
  padding: 10
});

export const secPopupContainer = style({
  textAlign: 'center',
  maxWidth: 600,
  width: '100%'
});

export const secPopupLogo = style([
  typography.title,
  {
    color: vars.colors.black,
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
]);

export const secPopupLogoIcon = style([
  logoIcon,
  {
    width: 40,
    height: 40
  }
]);

export const secPopupTitle = style([
  typography.title,
  {
    color: vars.colors.black,
    marginBottom: 8
  }
]);

export const secPopupText = style([
  typography.description,
  {
    color: vars.colors.grayTransparent,
    marginBottom: 8
  }
]);

export const secPopupButton = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 32
});
