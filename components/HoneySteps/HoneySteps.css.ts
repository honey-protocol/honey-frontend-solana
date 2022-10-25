import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';
import { executedIcon } from '../../styles/icons.css';

export const step = style({
  cursor: 'pointer'
});

export const steps = style({
  display: 'flex'
});

globalStyle(
  `.ant-steps.ant-steps-horizontal.ant-steps-default.ant-steps-label-horizontal`,
  {
    display: 'flex'
  }
);

globalStyle(
  `.ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item`,
  {
    paddingLeft: 8
  }
);

export const processContainerStyle = `${step}.ant-steps-item-process > .ant-steps-item-container`;
export const finishContainerStyle = `${step}.ant-steps-item-finish > .ant-steps-item-container`;
export const waitContainerStyle = `${step}.ant-steps-item-wait > .ant-steps-item-container`;

const antStepIcon = {
  width: 36,
  height: 36,
  borderRadius: 0,
  border: 'none'
};

const antStepItemTitle = {
  backgroundColor: vars.colors.grayDark,
  display: 'flex',
  height: 4,
  width: 18,
  borderRadius: 2
};

export const stepIcon = style([
  typography.body,
  {
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
]);

export const completedStepIcon = style([
  executedIcon,
  {
    height: 34
  }
]);

globalStyle(`${processContainerStyle} > .ant-steps-item-icon`, {
  background: 'none',
  ...antStepIcon
});

globalStyle(
  `${processContainerStyle} > .ant-steps-item-content > .ant-steps-item-title:after`,
  {
    left: 0,
    ...antStepItemTitle
  }
);

globalStyle(`${finishContainerStyle} > .ant-steps-item-icon`, {
  ...antStepIcon
});

globalStyle(
  `${finishContainerStyle} > .ant-steps-item-icon > .ant-steps-icon`,
  {
    ...antStepIcon
  }
);

globalStyle(
  `${finishContainerStyle} > .ant-steps-item-icon > .ant-steps-icon > span`,
  {
    display: 'none'
  }
);

globalStyle(
  `${finishContainerStyle} > .ant-steps-item-content > .ant-steps-item-title:after`,
  {
    left: 0,
    ...antStepItemTitle
  }
);

globalStyle(
  `${finishContainerStyle} > .ant-steps-item-content > .ant-steps-item-title:after`,
  {
    left: 0,
    ...antStepItemTitle
  }
);

globalStyle(
  `${processContainerStyle} > .ant-steps-item-content > .ant-steps-item-title:after`,
  {
    left: 0,
    ...antStepItemTitle
  }
);

globalStyle(`${waitContainerStyle} > .ant-steps-item-icon`, {
  background: 'none',
  borderRadius: 0,
  border: 'none'
});

globalStyle(`${waitContainerStyle} > .ant-steps-item-icon`, {
  background: 'none',
  ...antStepIcon
});

globalStyle(`${waitContainerStyle}`, {
  display: 'flex'
});

globalStyle(
  `${waitContainerStyle} > .ant-steps-item-content > .ant-steps-item-title`,
  {
    backgroundColor: vars.colors.grayDark,
    display: 'flex',
    paddingRight: 0
  }
);

globalStyle(
  `${waitContainerStyle} > .ant-steps-item-content > .ant-steps-item-title:after`,
  {
    ...antStepItemTitle
  }
);
