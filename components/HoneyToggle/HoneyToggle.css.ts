import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from 'styles/theme.css';

export const honeySwitch = style({
  backgroundImage: "none",
  backgroundColor: vars.colors.grayMiddle,
  selectors: {
    '&.ant-switch-checked': {
      backgroundColor: vars.colors.brownLight,
    },
    '&:focus': {
      boxShadow: 'none'
    }
  }
});

const honeySwitchChildSelector = (selector: string) => {
  return `${honeySwitch} ${selector}`;
};

const hscs = honeySwitchChildSelector;

globalStyle(hscs(`> .ant-click-animating-node`), {
  display: 'none'
})
