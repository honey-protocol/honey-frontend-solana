import { style } from '@vanilla-extract/css';
import {typography, vars} from "../../../styles/theme.css";
import {addIcon} from "../../../styles/icons.css";

export const lendP2PFiltersTab = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: 16
})

export const sidebarTitle = style({
    marginBottom: 12,
})

export const ruleWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
  })

export const addRuleWrapper = style({
  display: 'flex',
  width: '100%',
  marginBottom: 34,
  padding: 10,
  alignItems: 'center',
  cursor: 'pointer'
})

export const addRuleIcon = style([
  addIcon,
  {
    width: 12,
    height: 12,
  }
])

export const addRuleTitle = style([
  typography.button,
  {
    color: vars.colors.brownMiddle
  }
])

export const tagsTitle = style([
  typography.title,
  {
    marginBottom: 12
  }
])

export const tagsWrapper = style({
  display: 'flex',
  width: '110%',
  flexWrap: "wrap",
  marginBottom: 24,
})

export const sliderTitle = style({
  marginBottom: 12
})

export const sliderWrapper = style({
  marginBottom: 56
})


