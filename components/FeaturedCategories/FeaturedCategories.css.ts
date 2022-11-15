import { style } from '@vanilla-extract/css';
import {typography} from "../../styles/theme.css";

export const featureCategories = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: 24,
})

export const title = style({
    marginBottom: 20
})

export const categoriesWrapper = style({
  display: 'flex'
})