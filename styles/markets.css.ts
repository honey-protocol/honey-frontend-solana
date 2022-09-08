import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { typography, vars } from './theme.css';
import { container } from './common.css';

export const marketsPage = style([container, {}]);

export const nameCell = style({
  display: 'flex',
  alignItems: 'center'
});

export const collectionLogo = style({
  marginRight: '16px',
  width: '34px',
  height: '34px'
});

export const collectionName = style([
  typography.body,
  {
    width: 124,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
]);

export const availableCell = style([typography.numbersRegular, {}]);
export const valueCell = style([typography.numbersRegular, {}]);
export const rateCell = style([typography.numbersRegular, {}]);

export const buttonsCell = style( {
  display: 'flex',
  justifyContent: 'flex-end'
});

export const arrowPadding = style( {
  paddingRight: '8px'
});

export const arrowIcon = style( {
  width: 20,
  height: 20,
  background: 'url(/images/arrow-down.svg) center no-repeat'
});

export const expandedRow = style({});

export const inactiveRow = style({});

globalStyle(
  `${inactiveRow} ${availableCell}, ${inactiveRow} ${valueCell}, ${inactiveRow} ${rateCell}`,
  {
    opacity: 0.4
  }
);

export const expandSection = style({
  position: 'relative'
});

export const divider = style({
  position: 'absolute'
});

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
export const table = style({});
const tableChildSelector = (selector: string) => {
  return `${table} ${selector}`;
};
const tcs = tableChildSelector;

// globalStyle(tcs(`.ant-table-container > .ant-table-content > table > .ant-table-thead > tr > .ant-table-column-has-sorters > .ant-table-column-sorters > .ant-table-column-sorter`), {
//   display: "none"
// })
globalStyle(tcs(`.ant-table-column-sorter`), {
  display: 'none'
});
