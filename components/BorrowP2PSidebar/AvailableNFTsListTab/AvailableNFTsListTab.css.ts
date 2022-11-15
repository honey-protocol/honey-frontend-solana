import { style } from "@vanilla-extract/css";
import {typography} from "../../../styles/theme.css";

export const availableNFTsTab = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: 16,
})

export const title = style([
  typography.title,
  {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 18
  }
])