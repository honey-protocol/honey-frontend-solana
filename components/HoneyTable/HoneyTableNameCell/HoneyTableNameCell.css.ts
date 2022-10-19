import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../../styles/theme.css';

globalStyle(`.tableTitle`, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 11,
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
});

globalStyle(`.tableTitle:after`, {
  content: '',
  position: 'absolute',
  width: '100%',
  height: 2,
  bottom: 0,
  left: 0,
  backgroundImage: `linear-gradient(to right, ${vars.colors.grayDark} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '20px 1px, 20px 1px, 1px 20px, 1px 20px'
});

export const tableTitleLeft = style({
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  paddingRight: 10
});

export const tableTitleRight = style({});

