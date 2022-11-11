import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/theme.css';

export const aboutMarketStep = style({
  fontFamily: 'Scandia',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '50%',
  justifyContent: 'flex-start',
  alignItems: 'flex-start'
});

export const aboutMarketStepContainer = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  flexDirection: 'column'
});

export const stepTitle = style({
  display: 'flex',
  width: '100%',
  height: 32,
  fontWeight: 500,
  fontSize: 22,
  marginBottom: 16
});

export const foundCollectionInfo = style({
  display: 'flex',
  marginTop: 24,
  width: '100%'
});

export const collectionLogo = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 44,
  height: 40
});

export const collectionInfoContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginLeft: 14
});

export const collectionTitle = style({
  display: 'flex',
  width: '100%',
  fontSize: 16,
  fontWeight: 500,
  height: 20
});

export const collectionDescription = style({
  display: 'flex',
  width: '100%',
  color: vars.colors.grayTransparent,
  fontSize: 12,
  height: 14,
  fontWeight: 500
});

export const spacer = style({
  padding: '10px 0'
});
