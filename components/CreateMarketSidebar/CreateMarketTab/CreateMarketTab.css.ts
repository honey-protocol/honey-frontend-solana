import { style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const createMarketTab = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 16px 16px 16px'
});

export const createMarket = style({
  marginBottom: 16
});

export const createSteps = style({
  width: '100%',
  marginTop: 28
});

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
