import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const progress = style({
  width: 84,
  position: 'relative',
  ':after': {
    content: '',
    position: 'absolute',
    width: 2,
    height: 4,
    top: 3,
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: 3,
    background: vars.colors.grayDark
  },
  ':before': {
    content: '',
    position: 'absolute',
    width: 2,
    height: 4,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: 3,
    background: vars.colors.grayDark
  }
});

globalStyle(`${progress} .ant-progress-bg`, {
  height: '4px!important'
});
