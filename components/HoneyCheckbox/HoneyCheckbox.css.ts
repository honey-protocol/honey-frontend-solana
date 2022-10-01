import {globalStyle, style} from "@vanilla-extract/css";
import {vars} from "../../styles/theme.css";

export const honeyCheckbox = style({})

const checkboxChildSelector = (selector: string) => {
  return `${honeyCheckbox} ${selector}`;
};
const ccs = checkboxChildSelector;

globalStyle(ccs(`input[type='checkbox'] + span`), {
  width: 20,
  height: 20,
  background: 'none left top no-repeat',
  cursor: 'pointer',

  border: `2px solid ${vars.colors.grayDark}`,
  borderRadius: 4
})

globalStyle(ccs(`input[type='checkbox']+span:before`), {
  content: "",
  position: "absolute",
  width: "calc(100% + 4px)",
  height: "calc(100% + 4px)",
  top: -2,
  left: -2,
  transition: "all .1s",
  zIndex: 1,
  opacity: 0,
  background: vars.colors.brownLight,
  borderRadius: 4
})

globalStyle(ccs(`input[type='checkbox']+span:after`), {
  zIndex: 2,
  borderColor: vars.colors.black
})
globalStyle(ccs(`input[type='checkbox']:checked+span:before`), {
  opacity: 1
})

globalStyle(ccs(`input[type='checkbox']:disabled+span`), {
  opacity: 0.5,
  cursor: "no-drop"
})

globalStyle(ccs(`.ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner`), {
  borderColor: vars.colors.grayDark
})

globalStyle(ccs(`.ant-checkbox-checked::after`), {
  display: "none"
})

