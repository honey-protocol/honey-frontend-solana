import { style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from './theme.css';
import { honeyTableExpandedRow } from '../components/HoneyTable/HoneyTable.css';
import {
  pageTitle as pageTitleCommon,
  pageDescription as pageDescriptionCommon
} from './common.css';

export const pageHeader = style({
  display: 'flex',
  marginBottom: 16
});

export const pageTitle = style([pageTitleCommon]);

export const chartContainer = style({
  padding: '16px 12px',
  width: '100%',
  height: 258,
  background: vars.colors.white,
  borderRadius: 16,
  marginRight: 16
});

export const notificationsWrapper = style({
  width: 360
});

export const pageContent = style({
  marginTop: 32,
  height: '100vh'
});

export const pageContentElements = style({
  display: 'flex'
});

export const gridWrapper = style({
  marginRight: 16,
  width: '100%'
});