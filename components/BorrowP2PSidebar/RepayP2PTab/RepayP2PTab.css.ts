import { style, styleVariants } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const repayP2PTab = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  height: '100%',
  padding: 16
});

export const inputsAddons = styleVariants({
  icon: {
    background:
      'url("/images/inputs-percent-icon.svg") center center no-repeat ',
    transform: 'translate(-16px, 0)',
    height: 24,
    width: 24
  },
  title: [
    typography.body,
    {
      color: vars.colors.grayTransparent,
      transform: 'translate(-25px, 0)'
    }
  ],
  priceTitle: [
    typography.body,
    {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  ],
  tokenAddonWrapper: [
    typography.body,
    {
      display: 'flex'
    }
  ],
  tokenAddonIcon: {
    display: 'flex',
    alignItems: 'center',
    width: 20,
    height: 20
  },
  tokenAddonTitle: [
    typography.body,
    {
      display: 'flex',
      margin: '2px 0 0 4px'
    }
  ]
});

export const loanInfo = styleVariants({
  wrapper: {
    display: 'flex',
    width: '100%',
    margin: '0 0 24px 0'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  title: [typography.numbersLarge],
  description: [
    typography.caption,
    {
      color: vars.colors.grayTransparent
    }
  ]
});

export const userBalance = styleVariants({
  section: {
    marginBottom: 24
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: vars.colors.grayLight,
    width: '100%',
    padding: `8px 16px`,
    height: 52,
    borderRadius: 12
  },
  title: [
    typography.caption,
    {
      color: vars.colors.grayTransparent,
      marginBottom: 4
    }
  ],
  price: [typography.numbersRegular]
});

export const infoSection = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column'
});

export const title = style({
  marginBottom: 12
});

export const periodBlock = style({
  marginBottom: 16
});
