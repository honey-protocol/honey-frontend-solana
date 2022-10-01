import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

const rowsGapSize = 12;
export const honeyTableContainer = style({});

export const honeyTableShadow = style({});

const rootSelector = `.ant-table-wrapper.${honeyTableContainer}`;

const buildChildSelector = (selector: string) => {
  return `${rootSelector} ${selector}`;
};
const bcs = buildChildSelector;

globalStyle(`${bcs('.ant-table-container')}`, {
  background: 'unset !important'
});

globalStyle(
  `${bcs('.ant-table, .ant-table-thead, .ant-table-thead > tr > th')}`,
  {
    paddingTop: 0,
    paddingBottom: 0,
    background: 'none'
  }
);

globalStyle(`${bcs('.ant-table-thead > tr > th')}`, {
  padding: '0 16px',
  border: 'none',
  height: 30
});

globalStyle(`${bcs('.ant-table-thead > tr > th:before')}`, {
  display: 'none'
});

globalStyle(`${bcs('.ant-table table')}`, {
  borderCollapse: 'separate',
  borderSpacing: `0 ${rowsGapSize}px`
});

export const honeyTableRow = style({
  cursor: 'pointer'
});

const rowTdSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow} > td`;
// const rowHoverTdSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow}:hover > td`;

const tdStylesBase = {
  background: vars.colors.white,
  border: 'none',
  borderTop: `2px solid ${vars.colors.black}`,
  borderBottom: `2px solid ${vars.colors.black}`
};

globalStyle(`${bcs(rowTdSelector)}`, {
  ...tdStylesBase
});

// globalStyle(`${bcs(rowHoverTdSelector)}`, {
//   ...tdStylesBase,
//   borderColor: vars.colors.brownLight
// });

const firstCellBorderAndRadius = {
  borderLeft: `2px solid ${vars.colors.black}`,
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12
};
const lastCellBorderAndRadius = {
  borderRight: `2px solid ${vars.colors.black}`,
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12
};

globalStyle(`${bcs(`${rowTdSelector}:first-child`)}`, firstCellBorderAndRadius);
globalStyle(`${bcs(`${rowTdSelector}:last-child`)}`, lastCellBorderAndRadius);

// globalStyle(`${bcs(`${rowHoverTdSelector}:first-child`)}`, {
//   ...firstCellBorderAndRadius,
//   borderColor: vars.colors.brownLight
// });
// globalStyle(`${bcs(`${rowHoverTdSelector}:last-child`)}`, {
//   ...lastCellBorderAndRadius,
//   borderColor: vars.colors.brownLight
// });

export const honeyTableRowShadow = style({});
export const honeyTableRowSelected = style({});
const rowShadowTdSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow}.${honeyTableRowShadow} > td`;
const rowShadowTdHoverSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow}.${honeyTableRowShadow}:hover > td`;
const rowShadowTdSelectedSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow}.${honeyTableRowShadow}${honeyTableRowSelected} > td`;

globalStyle(rowShadowTdSelector, {
  boxShadow: `4px 4px 0px 0px ${vars.colors.black}`
});

globalStyle(rowShadowTdHoverSelector, {
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`
});

globalStyle(rowShadowTdSelectedSelector, {
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`
});

// Styles for Expanded section
export const expandedSectionRow = style({});
const expandedSectionRowTdSelector = `.ant-table-tbody > .ant-table-expanded-row.${expandedSectionRow} > td`;

globalStyle(`${bcs(expandedSectionRowTdSelector)}`, {
  background: vars.colors.white,
  border: 'none',
  borderBottom: `2px solid ${vars.colors.black}`,
  position: 'relative',
  // additional 1px to make sure it looks good everywhere
  top: -(rowsGapSize + 1),
  // TODO: add regular cell padding here
  paddingTop: rowsGapSize + 1,
  paddingLeft: 0,
  paddingRight: 0
});

globalStyle(`${bcs(`${expandedSectionRowTdSelector}:first-child`)}`, {
  ...firstCellBorderAndRadius,
  borderTopLeftRadius: 0,
  borderColor: vars.colors.black
});

globalStyle(`${bcs(`${expandedSectionRowTdSelector}:last-child`)}`, {
  ...lastCellBorderAndRadius,
  borderTopRightRadius: 0,
  borderColor: vars.colors.black
});

// Regular row styles if row is expanded
export const honeyTableExpandedRow = style({});
const expandedRowTdSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow}.${honeyTableExpandedRow} > td`;
globalStyle(bcs(expandedRowTdSelector), {
  borderColor: `${vars.colors.black} !important`,
  borderBottom: 'none'
});

globalStyle(bcs(`${expandedRowTdSelector}:first-child`), {
  borderBottomLeftRadius: 0
});

globalStyle(bcs(`${expandedRowTdSelector}:last-child`), {
  borderBottomRightRadius: 0,
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`
});

// Styles if row is inactive
export const honeyTableInactiveRow = style({});
const inactiveRowTdSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow}.${honeyTableInactiveRow} > td`;
const inactiveRowHoverTdSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow}.${honeyTableInactiveRow}:hover > td`;

globalStyle(bcs(inactiveRowTdSelector), {
  color: vars.colors.grayTransparent
});
globalStyle(`${bcs(inactiveRowTdSelector)}`, {
  borderColor: vars.colors.grayDark
});
globalStyle(inactiveRowTdSelector, {
  boxShadow: `4px 4px 0px 0px ${vars.colors.grayDark}`
});

globalStyle(`${bcs(`${inactiveRowTdSelector}:first-child`)}`, {
  ...firstCellBorderAndRadius,
  borderColor: vars.colors.grayDark
});
globalStyle(`${bcs(`${inactiveRowTdSelector}:last-child`)}`, {
  ...lastCellBorderAndRadius,
  borderColor: vars.colors.grayDark
});

globalStyle(`${bcs(inactiveRowHoverTdSelector)}`, {
  borderColor: vars.colors.brownLight
});
globalStyle(`${bcs(`${inactiveRowHoverTdSelector}:first-child`)}`, {
  ...firstCellBorderAndRadius,
  borderColor: vars.colors.brownLight
});
globalStyle(`${bcs(`${inactiveRowHoverTdSelector}:last-child`)}`, {
  ...lastCellBorderAndRadius,
  borderColor: vars.colors.brownLight
});
