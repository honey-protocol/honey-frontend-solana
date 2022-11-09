import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/theme.css';

export const newMarketPublicKey = style({
  display: 'flex'
});

export const publicKeyOverflow = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

export const marketAddress = style({
  width: '240px'
});
