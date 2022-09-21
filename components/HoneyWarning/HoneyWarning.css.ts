import { style } from '@vanilla-extract/css';
import {typography, vars} from "../../styles/theme.css";

export const warning = style({
  backgroundColor: vars.colors.secondaryBrownLight,
  borderRadius: 12,
  padding: '12px 12px 10px',
  width: '100%'
});

export const warningTitle = style([
  typography.caption,
  {
    color: vars.colors.brownMiddle,
    marginBottom: '0!important'
  }
]);

export const warningLink = style({
  display: 'flex',
  justifyContent: 'space-between'
});

export const warningLinkIcon = style({
  width: 12,
  height: 12,
  background: 'no-repeat center/contain url("/images/newPage.svg")',
  flexShrink: 0,
  marginLeft: 8
});
