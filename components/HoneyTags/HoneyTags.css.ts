import { style } from '@vanilla-extract/css';
import {typography, vars} from "../../styles/theme.css";

export const honeyTags = style([
  typography.caption,
  {
    display: 'flex',
    padding: '8px 12px',
    borderRadius: 12,
    background: vars.colors.grayMiddle,
    margin: 2,
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        background: vars.colors.secondaryBrownLight
      }
  }
}])

export const active = style({
  background: vars.colors.secondaryBrownLight,
  color: vars.colors.brownLight
})

