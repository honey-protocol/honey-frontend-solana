import { style } from '@vanilla-extract/css';
import { typography } from 'styles/theme.css';

export const emptyStateContent = style({
  width: '100%',
  maxWidth: '300px',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto'
});

export const emptyStateTitle = style([
  typography.body,
  {
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center'
  }
]);

export const emptyStateDescription = style([
  typography.description,
  {
    fontWeight: '500',
    textAlign: 'center'
  }
]);

export const emptyStateWalletBtn = style({
  marginTop: 12
});
