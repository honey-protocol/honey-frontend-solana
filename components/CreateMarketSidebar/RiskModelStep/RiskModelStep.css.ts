import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/theme.css';

export const riskModelStep = style({
  fontFamily: 'Scandia',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '50%',
  justifyContent: 'flex-start',
  alignItems: 'flex-start'
});

export const tabsContainer = style({
  width: '100%',
  marginBottom: '12px'
});

export const tabTitle = style({
  marginBottom: '16px'
});

export const graphContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '12px 16px 20px 16px',
  minHeight: 256,
  height: 256,
  flex: '1 0 256',
  marginBottom: '12px',
  border: `1px solid ${vars.colors.grayMiddle}`,
  borderRadius: '16px'
});

export const graphWrapper = style({
  position: 'relative',
  flex: '1 0 auto'
});

export const graphTitle = style({});

export const warningContainer = style({
  width: '100%'
});

export const marginTop = style({
  marginTop: 8
});
