import {style} from "@vanilla-extract/css";
import {typography, vars} from "../../../styles/theme.css";

export const NFTInfoSection = style( {
    display: 'flex',
    width: '100%',
    margin: '6px 0 18px 0'

})

export const NFTLogo = style({
  display: 'flex',
  width: 46,
  height: 46,
})

export const NFTLogoWrapper = style({
  width: 46,
  height: 46,
  display: 'flex',
})

export const NFTDescriptionWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 12,
  marginTop: 6
})

export const NFTTitle = style([
  typography.title
])

export const NFTCollectionTitle = style([
  typography.caption,
  {
    display: 'flex',
    width: '100%',
    color: vars.colors.brownMiddle
  }
])

export const NFTCollectionCheckIcon = style({
  background: 'url("/images/yellow-check-icon.svg") center center no-repeat',
  height: 16,
  width: 16,
  transform: 'translate(0, -3px)'
})