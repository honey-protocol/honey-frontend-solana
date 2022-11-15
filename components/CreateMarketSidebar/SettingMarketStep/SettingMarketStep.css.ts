import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';
import { calc } from '@vanilla-extract/css-utils';

export const settingMarketStep = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%'
});

export const liquidationFee = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

export const blockTitle = style([
  typography.title,
  {
    display: 'flex',
    width: '100%',
    fontSize: 22,
    marginBottom: 16,
    alignItems: 'center'
  }
]);

export const liquidationFeeTitle = style([blockTitle]);

export const adminFee = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: 24
});

export const adminFeeTitle = style([blockTitle]);

export const maximumLtv = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: 24
});

export const maximumLtvTitle = style([blockTitle]);

export const liquidationThreshold = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: 48
});

export const liquidationThresholdTitle = style([blockTitle]);

export const input = style([]);

export const inputWrapper = style({
  display: 'flex',
  position: 'relative',
  zIndex: 3,
  borderRadius: 12,
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      left: -2,
      top: -2,
      bottom: -2,
      right: -2,
      zIndex: -2,
      width: 'calc("100%" + 1px)',
      height: 'calc("100%" + 4px)',
      backgroundColor: 'transparent',
      border: `1px solid ${vars.colors.grayDark}`,
      borderRadius: 12
    },
    '&:hover::after': {
      border: `2px solid ${vars.colors.brownLight}`
    }
  }
});

export const inputBordersRed = style({});

globalStyle(`${inputWrapper}.${inputBordersRed}::after`, {
  border: `2px solid ${vars.colors.red}`
});

export const inputDescription = style([
  typography.description,
  {
    display: 'flex',
    width: '100%',
    fontSize: 12,
    marginTop: 8,
    height: 14,
    marginLeft: 10,
    color: vars.colors.grayTransparent
  }
]);

globalStyle(
  `${settingMarketStep} .ant-input-number-wrapper.ant-input-number-group > .ant-input-number-group-addon`,
  {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 0,
    borderColor: 'transparent'
  }
);
globalStyle(
  `${settingMarketStep} .ant-input-number-wrapper.ant-input-number-group > .ant-input-number-group-addon:hover`,
  {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderColor: 'transparent'
  }
);

export const inputButtons = style({
  display: 'flex',
  width: 18,
  height: '100%',
  flexDirection: 'column',
  cursor: 'pointer',
  border: 'none'
});
export const incrementValueButton = style({
  background: 'url("/images/arrow-up-icon.svg") center center no-repeat',
  backgroundSize: 'contain',
  height: 7,
  width: 12,
  marginBottom: 7
});
export const decrementValueButton = style({
  background: 'url("/images/arrow-down-icon.svg") center center no-repeat',
  backgroundSize: 'contain',
  height: 7,
  width: 12,
  marginTop: 8
});
