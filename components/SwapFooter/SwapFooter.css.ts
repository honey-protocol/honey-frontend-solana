import { style } from "@vanilla-extract/css";
import { typography, vars } from 'styles/theme.css';


export const swapFooter = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 24
})

export const footerTitle = style([
  typography.caption,
  {
    color: vars.colors.textTertiary
  }
])

export const logoWrapper = style({
  display: 'flex',
})

export const logo = style({
  background: 'url("/images/jupiter-logo.svg") center center no-repeat',
  width: 88,
  height: 28,
  marginTop: 8
})