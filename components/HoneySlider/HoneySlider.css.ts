import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const rangeContainer = style({
  display: 'flex'
});

export const sliderWrapper = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',

  selectors: {
    '&:not(:last-child)': {
      marginRight: 4
    }
  }
});

export const slider = style([
  typography.numbersRegular,
  {
    padding: 0,
    margin: 0,
    marginTop: 12
  }
]);

const sliderChildSelector = (selector: string) => {
  return `${slider} ${selector}`;
};
const scs = sliderChildSelector;

globalStyle(scs(`> .ant-slider-step > .ant-slider-dot`), {
  display: 'none'
});
globalStyle(scs(`> .ant-slider-mark`), {
  fontSize: 14,
  color: vars.colors.black
});
globalStyle(scs(`> .ant-slider-mark > .ant-slider-mark-text`), {
  color: vars.colors.black
});
globalStyle(scs(`> .ant-slider-rail`), {
  backgroundColor: `${vars.colors.grayMiddle} !important`
});
globalStyle(scs(`> .ant-slider-handle:focus`), {
  boxShadow: 'none'
});

export const disabledBackgroundSlider = style({});
globalStyle(`${disabledBackgroundSlider} > .ant-slider-rail`, {
  background: `linear-gradient(-45deg, rgba(0, 0, 0, 0) 49.9%, ${vars.colors.black} 49.9%, ${vars.colors.black} 77%, rgba(0, 0, 0, 0) 43% ), linear-gradient(-45deg, red 10%, rgba(0, 0, 0, 0) 10% )`,
  backgroundSize: '8px 6px'
});

export const enabledWarningBackgroundSlider = style({});
globalStyle(`${enabledWarningBackgroundSlider} > .ant-slider-track`, {
  background: `linear-gradient(-45deg, transparent 49.9%, ${vars.colors.brownMiddle} 49.9%, ${vars.colors.brownMiddle} 77%, transparent 43% ), linear-gradient(-45deg, ${vars.colors.brownMiddle} 10%, transparent 10% )`,
  backgroundSize: '8px 6px'
});

export const enabledBackgroundSlider = style({});
globalStyle(`${enabledBackgroundSlider} > .ant-slider-track`, {
  background: `linear-gradient(-45deg, transparent 49.9%, ${vars.colors.greenDarkest} 49.9%, ${vars.colors.greenDarkest} 77%, transparent 43% ), linear-gradient(-45deg, ${vars.colors.greenDarkest} 10%, transparent 10% )`,
  backgroundSize: '8px 6px'
});

export const sliderHeader = styleVariants({
  primary: [typography.numbersRegular, {
    whiteSpace: 'nowrap'
  }],
  secondary: [
  typography.numbersRegular,
  {
    color: vars.colors.grayTransparent,
    textAlign: 'right',
    whiteSpace: 'nowrap'
  }
]
});
