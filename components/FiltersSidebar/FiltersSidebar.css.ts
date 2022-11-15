import { style } from '@vanilla-extract/css';
import {sidebar} from "../../styles/common.css";
import {lightIcon} from "../../styles/icons.css";

export const filtersSidebar = style([
  sidebar,
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  }
])

export const lightLogoWrapper = style([
  lightIcon,
  {
    width: 52,
    height: 52,
  }
]);
