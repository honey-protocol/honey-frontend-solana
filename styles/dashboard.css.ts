import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';
import {
  pageTitle as pageTitleCommon,
} from './common.css';

export const dashboard = style({
  paddingBottom: 32
});

export const pageHeader = style({
  display: 'flex',
  marginBottom: 16
});

export const pageTitle = style([pageTitleCommon]);

export const chartContainer = style({
  padding: 12,
  paddingBottom: 0,
  width: '100%',
  height: 258,
  background: vars.colors.white,
  borderRadius: 16,
  marginRight: 16
});

export const notificationsWrapper = style({
  width: 360
});

export const pageContentElements = style({
  display: 'flex',
  marginTop: 20
});

export const gridWrapper = style({
  marginRight: 16,
  width: '100%'
});
