import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const honeyTableContainer = style({});

export const honeyTableShadow = style({});

const rootSelector = `.ant-table-wrapper.${honeyTableContainer}`;

const buildChildSelector = (selector: string) => {
  return `${rootSelector} ${selector}`;
};
const bcs = buildChildSelector;

globalStyle(`${bcs('')}`, {});

globalStyle(
  `${bcs('.ant-table, .ant-table-content,.ant-table-container')}`,
  {}
);

globalStyle(`${bcs('.ant-table-container')}`, {
  background: 'unset!important'
});

globalStyle(
  `${bcs('.ant-table, .ant-table-thead, .ant-table-thead > tr > th')}`,
  {
    background: 'none'
  }
);

globalStyle(`${bcs('.ant-table-thead > tr > th')}`, {
  padding: '0 16px'
});

globalStyle(`${bcs('.ant-table table')}`, {
  borderCollapse: 'separate',
  borderSpacing: '0 8px'
});

export const honeyTableRow = style({
  background: 'none'
});

export const honeyTableRowShadow = style({});

const tableTdSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow} > td`;
const tableShadowTdSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow}.${honeyTableRowShadow} > td`;

globalStyle(tableShadowTdSelector, {
  boxShadow: `4px 4px 0px 0px ${vars.colors.grayDark}`
});

globalStyle(`${bcs(tableTdSelector)}`, {
  background: vars.colors.white,
  border: 'none',
  borderTop: `2px solid ${vars.colors.grayDark}`,
  borderBottom: `2px solid ${vars.colors.grayDark}`
});

const firstCellBorderAndRadius = {
  borderLeft: `2px solid ${vars.colors.grayDark}`,
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12
};
const lastCellBorderAndRadius = {
  borderRight: `2px solid ${vars.colors.grayDark}`,
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12
};

globalStyle(
  `${bcs(`${tableTdSelector}:first-child`)}`,
  firstCellBorderAndRadius
);

globalStyle(`${bcs(`${tableTdSelector}:last-child`)}`, lastCellBorderAndRadius);

// Styles for Expanded section
export const expandedSectionRow = style({});
const expandedSectionRowTdSelector = `.ant-table-tbody > .ant-table-expanded-row.${expandedSectionRow} > td`;
const rowsGapSize = 8;

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

globalStyle(`${bcs(expandedRowTdSelector)}`, {
  borderColor: `${vars.colors.black}`,
  borderBottom: 'none'
});

globalStyle(`${bcs(`${expandedRowTdSelector}:first-child`)}`, {
  borderBottomLeftRadius: 0
});

globalStyle(`${bcs(`${expandedRowTdSelector}:last-child`)}`, {
  borderBottomRightRadius: 0,
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`
});

export const honeyTableInactiveRow = style({});
