import { style, globalStyle } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';
import { verifyIcon } from '../../styles/icons.css';

export const statusCard = style({
  border: `2px solid ${vars.colors.white}`,
  borderRadius: 12,
  padding: '0 12px',
  height: 30,
  display: 'inline-flex',
  textAlign: 'center',
  alignItems: 'center',
  maxWidth: '100%'
})

export const status = style([
  typography.caption,
  {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  }
])

export const verifiedIcon = style([
  verifyIcon,
  {
    width: 12,
    height: 12,
    marginLeft: 4
  }
]);

export const verified = style({
  background: vars.colors.secondaryBrownLight
});
globalStyle(`${verified} .ant-typography`, {
  color: vars.colors.brownMiddle
});

export const noVerified = style({
  background: vars.colors.grayMiddle
});