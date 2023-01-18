import { style, styleVariants } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const borrowP2PRequestTab = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  height: '100%',
  padding: 16
});

export const sectionsTitle = style([
  typography.title,
  {
    marginBottom: 12
  }
]);

export const sectionsSeparator = style({
  display: 'flex',
  background: 'url("/images/swap-info-block-line.svg") center center',
  width: '100%',
  height: 2,
  margin: '20px 0 24px 0'
});

export const sectionsInput = style([
  typography.numbersRegular,
  {
    width: '100%',
    display: 'flex',
    marginBottom: 8
  }
]);

export const inputsAddonsIcon = style({
  background: 'url("/images/inputs-percent-icon.svg") center center no-repeat ',
  transform: 'translate(-16px, 0)',
  height: 24,
  width: 24
});

export const inputsAddonsTitle = style([
  typography.body,
  {
    color: vars.colors.grayTransparent,
    transform: 'translate(-25px, 0)'
  }
]);

export const inputsAddonsPriceTitle = style([
  typography.body,
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }
]);

export const inputsAddonsTokenAddonWrapper = style([
  typography.body,
  {
    display: 'flex'
  }
]);

export const inputsAddonsTokenAddonIcon = style({
  display: 'flex',
  alignItems: 'center',
  width: 20,
  height: 20
});

export const inputsAddonsTokenAddonTitle = style([
  typography.body,
  {
    display: 'flex',
    margin: '2px 0 0 4px'
  }
]);

export const amountSection = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

export const requestDetailsSection = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

export const contactsSection = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

export const infoSection = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column'
});

export const buttons = style([
  {
    display: 'flex'
  }
]);

export const smallCol = style([
  {
    flex: '0 0 auto',
    marginRight: '12px'
  }
]);

export const bigCol = style([
  {
    flex: '1 0 auto'
  }
]);
