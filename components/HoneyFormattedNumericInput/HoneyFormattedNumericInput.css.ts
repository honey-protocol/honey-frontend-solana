import { globalStyle, style } from '@vanilla-extract/css';
import { input } from '../CreateMarketSidebar/SettingMarketStep/SettingMarketStep.css';
import { typography, vars } from '../../styles/theme.css';

export const honeyFormattedInput = style([
  typography.numbersRegular,
  {
    width: '100%',
    height: '100%',

    background: 'transparent',
    margin: 0,
    selectors: {
      '&::placeholder': {
        color: vars.colors.grayTransparent
      }
    }
  }
]);
const honeyFormattedInputBorderedSelector = `${honeyFormattedInput}:not(.ant-input-number-borderless)`;

globalStyle(`${honeyFormattedInputBorderedSelector}`, {
  border: `2px solid ${vars.colors.grayDark}`,
  borderRadius: 11
});

globalStyle(`${honeyFormattedInput} .ant-input-number-out-of-range input`, {
  color: 'inherit'
});

globalStyle(`${honeyFormattedInputBorderedSelector} .ant-input-number-input`, {
  height: 'auto',
  padding: 16,
  borderColor: 'transparent'
});
globalStyle(`${honeyFormattedInputBorderedSelector}.ant-input-number:hover`, {
  height: 'auto',
  borderColor: 'transparent'
});
globalStyle(`${honeyFormattedInputBorderedSelector}.ant-input-number`, {
  borderRight: 'none',
  boxShadow: 'none',
  borderColor: 'transparent'
});
globalStyle(`${honeyFormattedInputBorderedSelector}.ant-input-number:focus`, {
  borderRight: 'none',
  borderColor: 'transparent'
});
globalStyle(`${honeyFormattedInputBorderedSelector}.ant-input-number:active`, {
  borderRight: 'none',
  borderColor: 'transparent'
});

globalStyle(
  `${honeyFormattedInputBorderedSelector} .ant-input-number-group-addon:last-child`,
  {
    ...typography.body,
    background: 'transparent',
    border: 'none',
    opacity: 0.5
  }
);
