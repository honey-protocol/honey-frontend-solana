import { style } from '@vanilla-extract/css';
import { typography, vars } from "../../styles/theme.css";
import {arrowRight} from "../../styles/icons.css";

export const featuredCategoriesCard = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 395,
  padding: '16px 26px',
  background: vars.colors.white,
  borderRadius: 16,
  cursor: 'pointer',
  selectors: {
    '&:not(:last-child)': {
      marginRight: 16,
    }
  }
})

export const description = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent
  }
])

export const textWrapper = style({
  width: '100%',
  overflow: 'hidden'
})

export const logoWrapper = style({
  display: 'flex',
  height: 48,
  width: 48,
  flexShrink: 0,
  marginRight: 16,
})

export const logo = style({
  height: 48,
  width: 48,
  transform: 'translate(-1px, 1px)'
})

export const arrow = style([
  arrowRight,
  {
    width: 10,
    height: 12,
    flexShrink: 0,
    marginLeft: 12
  }
])

export const cardTitle = style({
  display:'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const titleWrapper = style({
  display:'flex',
  alignItems: 'center',
})