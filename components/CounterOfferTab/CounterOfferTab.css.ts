import { styleVariants, style } from "@vanilla-extract/css";
import { typography, vars } from "../../styles/theme.css";
import { copyIcon, dotterSeparator } from "../../styles/icons.css";
import { sidebar } from "styles/common.css";

export const counterOfferTab = style([
  sidebar,
  {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
    padding: 16,
}])

export const title = style([
  typography.title,
  {
    padding: '8px 0 16px 0'
  }
])

export const inputs = style({
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    paddingBottom: 8,
})

export const inputsTitle = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
  }
])

export const inputsSubtitle = style([
  typography.numbersRegular,
  {
    margin: '4px 0 16px 0'
  }
])

export const inputsAddon = style([
  typography.body,
  {
    color: vars.colors.grayTransparent,
  }
])

export const separator = style([
  dotterSeparator,
  {
    margin: '12px 0 24px 0'
  }
])

export const otherOffersSection = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const otherOffersSectionTitle = style([

  typography.title,
  {
    marginBottom: 18,
  }
])

export const otherOffersSectionOffers = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const offerItem = style({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  marginBottom: 28,
})

export const offerItemDescriptionBlock = style({
  display: 'flex',
  flexDirection: 'column',
})

export const offerItemRateBlock = style({
  display: 'flex',
  flexDirection: 'column',
})

export const offerItemTitle = style([
  typography.numbersRegular,
  {
    marginRight: 2,
    width: 192,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
])

export const offerItemTitleWrapper = style({
  display: 'flex',
  paddingBottom: 2,
})

export const offerItemDate = style([
  typography.numbersMini,
  {
    color: vars.colors.grayTransparent,
  }
])

export const offerItemTitleAddon = style([
  copyIcon,
  {
    width: 14,
    height: 14,
  }
])

export const offerItemRate = style([
  typography.numbersRegular,
  {
    paddingBottom: 2,
  }
])

export const offerItemPeriod = style([
  typography.numbersMini,
  {
    color: vars.colors.grayTransparent,
    textAlign: 'center'
  }
])

export const buttonContainer = styleVariants({
  enable: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  disable: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
  }
})

export const buttonTitle = style([
  typography.button,
  {
    display: 'flex',
    alignItems: 'center'
  }
])

export const buttonFeesWrapper = styleVariants({
  enable: {
    display: 'flex',
    flexDirection: 'column'
  },
  disable: {
    display: 'none'
  }
})

export const buttonFeeTitle = style([
  typography.numbersMini,
  {
    display: 'flex',
    justifyContent: 'flex-end',
  }
])

export const buttonFeeDescription = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    textTransform: 'none'
  }
])