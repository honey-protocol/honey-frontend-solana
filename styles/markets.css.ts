import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from './theme.css';
import { lampIcon } from './icons.css';
import { container } from './common.css';
import { honeyTableExpandedRow } from '../components/HoneyTable/HoneyTable.css';

export const marketsPage = style([container, {}]);

// TABLE
export const nameCell = style({
  display: 'flex',
  alignItems: 'center'
});

export const nameCellMobile = style({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  overflow: 'hidden'
});

export const logoWrapper = style({
  marginRight: 12
});
export const collectionLogo = style({
  width: '34px',
  height: '34px',
  minWidth: '34px',
  flexShrink: 0
});

export const collectionName = style([
  typography.body,
  {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
]);
export const collectionNameMobile = style([
  typography.body,
  {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '@media': {
      [`screen and (max-width: ${breakpoints.mobile}px)`]: {
        fontSize: 12
      }
    }
  }
]);

export const availableCell = style([typography.numbersRegular, {}]);
export const valueCell = style([typography.numbersRegular, {}]);
export const rateCell = style([typography.numbersRegular, {}]);
export const rateCellMobile = style([
  typography.numbersMini,
  {
    color: vars.colors.green
  }
]);

export const buttonsCell = style({
  display: 'flex',
  justifyContent: 'center',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      justifyContent: 'flex-end'
    }
  }
});

export const hideTextMobile = style({
  gap: '0',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      gap: '10px'
    }
  }
});

export const hideOnlyMobile = style({
  display: 'none',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'block'
    }
  }
});

export const showOnlyMobile = style({
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'none'
    }
  }
});

globalStyle(`${hideTextMobile} > span`, {
  display: 'none',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'block'
    }
  }
});

const rowBase = style({
  cursor: 'pointer'
});
export const expandedRow = style([rowBase, {}]);

export const arrowIcon = style({
  width: 20,
  height: 20,
  background: 'url(/images/arrow.svg) center no-repeat',
  transition: 'all .3s',
  selectors: {
    [`${honeyTableExpandedRow} &`]: {
      transform: 'rotate(-180deg)'
    }
  }
});

export const mobileTableHeader = style({
  display: 'flex',
  alignItems: 'center',
  background: vars.colors.grayLight,
  borderRadius: 12,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'none'
    }
  }
});

export const showTablet = style({
  display: 'block',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'none'
    }
  }
});

export const hideTablet = style({
  display: 'none',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      display: 'block'
    }
  }
});

export const mobileRow = style({
  flex: '1 0 50%'
});

export const table = style({});
const tableChildSelector = (selector: string) => {
  return `${table} ${selector}`;
};
const tcs = tableChildSelector;
globalStyle(tcs(`.ant-table-cell`), {
  borderSpacing: '0 !important',
  padding: 8,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      padding: 15
    }
  }
});
globalStyle(tcs(`.ant-table-expanded-row > .ant-table-cell`), {
  paddingBottom: 0,
  boxShadow: '4px 4px 0px 0px rgb(231 180 0)'
});
globalStyle(tcs(`.ant-table-row-level-0::before`), {
  position: 'absolute',
  top: 20,
  width: 100,
  height: 100,
  background: 'black'
});
globalStyle(tcs(`tr.ant-table-expanded-row > .ant-table-cell`), {
  paddingTop: '0 !important'
});

// MY COLLECTIONS TOGGLE

export const toggle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end'
});

export const toggleText = style([
  typography.button,
  {
    marginLeft: 12
  }
]);

const headerCellBasic = style([
  typography.button,
  {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    color: vars.colors.black
  }
]);
export const headerCell = styleVariants({
  active: [
    headerCellBasic,
    {
      color: vars.colors.brownMiddle
    }
  ],
  disabled: [
    headerCellBasic,
    {
      color: vars.colors.black
    }
  ]
});

const sortIconBasic = style({
  width: 20,
  height: 20,
  marginLeft: 4
});

export const sortIcon = styleVariants({
  disabled: [
    sortIconBasic,
    {
      background: 'url(/images/sorter.svg) center no-repeat'
    }
  ],
  ascend: [
    sortIconBasic,
    {
      background: 'url(/images/sorter-active.svg) center no-repeat',
      transform: 'rotate(180deg)'
    }
  ],
  descend: [
    sortIconBasic,
    {
      background: 'url(/images/sorter-active.svg) center no-repeat'
    }
  ]
});

globalStyle(tcs(`.ant-table-column-sorter`), {
  display: 'none'
});

export const expandSection = style({
  position: 'relative',
  overflow: 'hidden',
  paddingTop: 5,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      paddingTop: 0
    }
  }
});
export const expandContentTable = style({});
const expandContentTableChildSelector = (selector: string) => {
  return tcs(`${expandContentTable} ${selector}`);
};
const ectcs = expandContentTableChildSelector;
globalStyle(ectcs(`.ant-table-cell`), {
  border: 'none !important',
  background: 'transparent !important',
  padding: 8,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      padding: 15
    }
  },
});
globalStyle(ectcs(`.ant-table-row`), {
  borderSpacing: 0
});
globalStyle(ectcs(`.ant-table table`), {
  borderSpacing: '0 !important'
});
globalStyle(ectcs(`.ant-table-footer`), {
  background: 'transparent',
  padding: 8,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      padding: 15
    }
  }
});

export const expandedRowCell = style([]);
export const expandedRowNameCell = style([
  nameCell,
  {
    display: 'flex',
    alignItems: 'center'
  }
]);
export const risk = styleVariants({
  safe: {
    color: vars.colors.green
  },
  warning: {
    color: vars.colors.brownLight
  },
  danger: {
    color: vars.colors.red
  }
});
export const riskText = style([
  typography.caption,
  {
    display: 'none',
    '@media': {
      [`screen and (min-width: ${breakpoints.tablet}px)`]: {
        display: 'initial'
      }
    }
  }
]);
export const expandedRowIcon = style({
  background: 'url(/images/direct-left.svg) center no-repeat',
  width: 40,
  height: 40,
  marginRight: 11,
  flexShrink: 0,
  backgroundSize: '20px',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      marginRight: 4
    }
  }
});
export const lampIconStyle = style([
  lampIcon,
  {
    width: 32,
    height: 32,
    backgroundColor: vars.colors.white
  }
]);
export const swapWalletIcon = style({
  background: 'url(/images/swap-wallet.svg) center no-repeat',
  width: 20,
  height: 20
});
export const arrowRightIcon = style({
  background: 'url(/images/arrow-right.svg) center no-repeat',
  width: 20,
  height: 20
});
export const nameCellText = style({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 12,
  overflow: 'hidden'
});

export const expandedSection = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      flexWrap: 'initial'
    }
  }
});

export const expandedSectionFooter = style({
  display: 'flex',
  alignItems: 'flex-start',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      flexWrap: 'initial'
    }
  }
});

export const footerButton = style({
  width: '100%',
  marginTop: 16,
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      width: 'auto',
      marginLeft: 'auto',
      marginTop: 0
    }
  }
});

export const mobileConnectButton = style({
  justifyContent: 'center',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      justifyContent: 'space-between'
    }
  }
});
export const footer = style({
  display: 'flex'
});
export const footerText = style({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 15
});
export const footerTitle = style([typography.body, {
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      fontSize: 12
    }
  }
}]);
export const footerDescription = style([
  typography.description,
  {
    color: vars.colors.grayTransparent,
    '@media': {
      [`screen and (max-width: ${breakpoints.mobile}px)`]: {
        fontSize: 12
      }
    }
  }
]);
export const dashedDivider = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: 2,
  backgroundImage: `linear-gradient(to right, ${vars.colors.black} 50%, transparent 50%)`,
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      left: 70,
      backgroundImage: `linear-gradient(to right, ${vars.colors.lightGrayTransparent} 50%, transparent 50%)`,
      backgroundSize: '20px 2px, 20px 2px, 2px 20px, 2px 20px',
    }
  }
});
globalStyle(tcs(`.ant-table-column-sorter`), {
  display: 'none'
});

export const emptyTable = style({});
globalStyle(`${emptyTable} tbody`, {
  display: 'none'
});

export const emptyStateContainer = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  flex: 1
});

export const docIcon = style({
  width: 52,
  height: 52,
  background: 'url("/images/docIcon.svg") center center no-repeat'
});
