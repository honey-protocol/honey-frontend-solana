import {style, styleVariants} from "@vanilla-extract/css";
import {typography, vars} from "../../styles/theme.css";

export const periodSelector = style({
  display: 'flex',
  justifyContent: 'center',
});
export const periodSelectorContent = style({
  display: 'flex',
  background: vars.colors.grayMiddle,
  borderRadius: 10,
  padding: 2
});
const periodSelectorItemBase = style([
  typography.button,
  {
    padding: '6px 12px',
    cursor: 'pointer',
    position: 'relative'
  }
]);
export const verticalDivider = style({
  position: 'absolute',
  width: 2,
  height: 20,
  background: 'url("/images/vertical-divider.svg") center no-repeat',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)'
});

export const periodSelectorItem = styleVariants({
  active: [
    periodSelectorItemBase,
    {
      borderRadius: 8,
      background: vars.colors.white
    }
  ],
  passive: [periodSelectorItemBase, {}]
});