import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const honeyTableContainer = style({});

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

globalStyle(`${bcs('.ant-table, .ant-table-thead')}`, {
  background: 'none'
});

globalStyle(`${bcs('.ant-table table')}`, {
  borderCollapse: 'separate',
  borderSpacing: '0 8px'
});

export const honeyTableRow = style({
  background: 'none'
});

const tableTdSelector = `.ant-table-tbody > .ant-table-row.${honeyTableRow} > td`;

globalStyle(`${bcs(tableTdSelector)}`, {
  background: vars.colors.white,
  border: 'none',
  borderTop: `2px solid ${vars.colors.grayDark}`,
  borderBottom: `2px solid ${vars.colors.grayDark}`
});

globalStyle(`${bcs(`${tableTdSelector}:first-child`)}`, {
  borderLeft: `2px solid ${vars.colors.grayDark}`,
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12
});

globalStyle(`${bcs(`${tableTdSelector}:last-child`)}`, {
  borderRight: `2px solid ${vars.colors.grayDark}`,
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12
});
