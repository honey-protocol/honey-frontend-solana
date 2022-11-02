import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const link = style([
  typography.description,
  {
    color: `${vars.colors.brownMiddle}!important`,
    borderBottom: '1px solid rgba(231, 180, 0, 0.6)',
    position: 'relative',
    marginRight: 15
  }
]);

globalStyle(`${link}:after`, {
  position: 'absolute',
  content: '',
  top: '50%',
  transform: 'translateY(-50%)',
  right: '-15px',
  width: 12,
  height: 12,
  background: 'no-repeat center/contain url("/images/newPage.svg")'
});