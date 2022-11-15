import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';
import { copyIcon, verifyIcon } from '../../styles/icons.css';

export const lendForm = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: vars.colors.white,
  padding: 16
});

const formSection = style([
  {
    marginBottom: '24px'
  }
]);

export const row = style([
  formSection,
  {
    display: 'flex'
  }
]);

export const col = style({
  flex: '100% 0 0'
});

export const nftInfo = style([
  row,
  {
    alignItems: 'center',
    marginBottom: 16
  }
]);

export const nftImage = style([
  {
    width: 46,
    height: 46,
    marginRight: 15
  }
]);

export const nftName = style([typography.title, {}]);

export const collectionName = style([typography.caption, {
  color: vars.colors.brownMiddle,
  display: 'flex',
  alignItems: 'center'
}]);

export const nftNameBlock = style({});

export const verifiedIcon = style([
  verifyIcon,
  {
    width: 12,
    height: 12,
    marginLeft: 2
  }
]);

export const balance = style({
  marginBottom: 16
});

export const inputs = style([
  {
    marginBottom: 16
  }
]);

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

export const warning = style({
  marginBottom: 24
});

export const borrower = style({
  marginBottom: 16
});

export const borrowerCopy = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12
});

export const borrowerAddress = style([
  typography.description,
  {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: vars.colors.grayTransparent
  }
]);

export const bidCardCopyIcon = style([
  copyIcon,
  {
    width: '20px',
    height: '20px',
    flexShrink: 0,
    marginLeft: 5,
    cursor: 'pointer'
  }
]);

export const contactsBlock = style( {
  marginBottom: 16,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const contacts = style( {});

export const contactsLink = style( [
  typography.numbersRegular,
  {
    color: vars.colors.grayTransparent,
    transition: 'all 0.3s'
  }
]);

globalStyle(`${contactsBlock}:hover svg path`, {
  stroke: vars.colors.brownMiddle
})

globalStyle(`${contactsBlock}:hover ${contactsLink}`, {
  color: vars.colors.brownMiddle
})

globalStyle(`${contactsBlock} svg`, {
  width: 20,
  height: 20,
  flexShrink: 0,
  marginLeft: 8
})

globalStyle(`${contactsBlock} svg path`, {
  stroke: vars.colors.grayTransparent,
  transition: 'all 0.3s'
})

export const contactsTitle = style( [
  typography.caption,
  {
    color: vars.colors.grayTransparent
  }
]);

globalStyle(`.ant-typography ${contactsTitle}`, {
  marginBottom: 4
})

globalStyle(`.ant-typography ${contactsLink}`, {
  marginBottom: 0
})

export const title = style( {
  marginBottom: 12
});

export const periodBlock = style( {
  marginBottom: 16
});
