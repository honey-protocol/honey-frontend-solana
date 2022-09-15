import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

const borderSlideIn = keyframes({
  '0%': {
    width: '0'
  },
  '100%': {
    width: 'calc(100% + 4px)'
  }
});

export const toast = style({
  borderRadius: vars.space.small,
  border: '2px solid black',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.small
});

export const row = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: vars.space.small
});

export const primaryText = style([typography.body]);

export const secondaryText = style([
  typography.caption,
  {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline'
    }
  }
]);

export const loading = style({
  borderColor: vars.colors.brownMiddle
});

globalStyle(`${loading} .${primaryText}, ${loading} .anticon `, {
  color: vars.colors.brownMiddle,
  fontSize: '16px'
});

const getStylesForMovingBorder = (color: string) => {
  const className = style({
    position: 'relative',
    zIndex: 1,
    background: 'white',
    border: `2px solid ${vars.colors.grayDark}`,
    ':before': {
      background: color,
      left: '-2px',
      top: '-2px',
      height: 'calc(100% + 4px)',
      width: 'calc(100% + 4px)',
      animation: `${borderSlideIn} 5s ease-out`
    },
    ':after': {
      background: vars.colors.white,
      left: '0',
      top: '0',
      width: '100%',
      height: '100%'
    }
  });
  globalStyle(`${className}:before, ${className}:after`, {
    content: '',
    position: 'absolute',
    zIndex: -1,
    borderRadius: vars.space.small
  });

  // pause animation on hover
  // globalStyle(`${className}:hover:before`, {
  //   animationPlayState: 'paused'
  // });
  return className;
};
export const success = getStylesForMovingBorder(vars.colors.green);

globalStyle(`${success} .${primaryText}, ${success} .anticon`, {
  color: vars.colors.green,
  fontSize: '16px'
});

export const error = getStylesForMovingBorder(vars.colors.red);

globalStyle(`${error} .${primaryText}, ${error} .anticon`, {
  color: vars.colors.red,
  fontSize: '16px'
});

export const newPageArrow = style({
  minWidth: 12,
  height: 12,
  background: 'url("/images/new-page-arrow.svg") center center no-repeat'
});

export const spinner = style({
  minWidth: 18,
  height: 18,
  background: 'url("/images/spinner.svg") center center no-repeat'
});
