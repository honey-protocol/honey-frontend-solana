import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';
import { infoIcon } from '../../styles/icons.css';

export const container = style({
  cursor: 'pointer'
});
export const tooltip = style({
  maxWidth: 'unset'
});

globalStyle(`${tooltip} .ant-tooltip-arrow`, {
  display: 'none'
});

globalStyle(`${tooltip} .ant-tooltip-content`, {
  ...typography.description,
  background: vars.colors.red,
  transition: 'all .5s',
  borderRadius: vars.space.medium,
  border: `2px solid ${vars.colors.borderPrimary}`,
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`,
  color: `${vars.colors.text} !important`,
  fontWeight: '500',
  width: 'max-content',
  maxWidth: '300px',
  padding: '12px 16px'
});

export const label = style([
  typography.description,
  {
    fontWeight: '500',
    color: vars.colors.text
  }
]);

export const tooltipIcon = style([
  infoIcon,
  {
    width: 18,
    height: 18,
    marginLeft: 8
  }
]);
