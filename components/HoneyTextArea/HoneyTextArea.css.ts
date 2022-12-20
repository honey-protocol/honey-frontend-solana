import {globalStyle, style} from "@vanilla-extract/css";
import {typography, vars} from "../../styles/theme.css";

export const honeyTextArea = style({
  display: "flex",
  padding: 16,
  borderRadius: 12,
  border: `2px solid ${vars.colors.grayDark}`,
  position: 'relative',
  height: '100%'
})

export const activeTextArea = style({
  borderColor: vars.colors.brownLight
})

export const invalidValueTextArea = style({
  borderColor: vars.colors.red
});
export const title = style([typography.caption, {
  position: "absolute",
    padding: '0 4px',
    background: vars.colors.white,
    zIndex: 2,
    top: -7,
    left: 16,
    color: vars.colors.grayDark
  }
]);

export const activeTitle = style({
  color: vars.colors.brownLight
});

globalStyle(`${invalidValueTextArea} ${title}`, {
  color: vars.colors.red
});
export const counter = style([typography.caption, {
  whiteSpace: "nowrap",
    color: vars.colors.grayDark
}])

const textareaChildSelector = (selector: string) => {
  return `${honeyTextArea} ${selector}`;
};
const tcs = textareaChildSelector;

globalStyle(tcs('.ant-input'), {
  ...typography.body,
  paddingTop: 0,
  paddingLeft: 0,
  paddingBottom: 0,
  caretColor: vars.colors.brownLight,
  height: '100% !important'
})

globalStyle(tcs('.ant-input::selection'), {
  background: vars.colors.brownLight
});

export const errorText = style([
  typography.body,
  {
    color: vars.colors.red,
    fontSize: 12
  }
]);
