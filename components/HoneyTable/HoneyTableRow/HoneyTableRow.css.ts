import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../../styles/theme.css';

export const table = style({
  background: '#FFFFFF',
  border: '2px solid #111111',
  boxShadow: '2px 2px 0px #111111',
  borderRadius: '12px',
  width: '100%',
  display: 'table',
  tableLayout: 'fixed',
  overflow: 'hidden',
  marginBottom: 16
});

export const tableLayout = style({
  width: '100%',
  display: 'table',
  tableLayout: 'fixed',
});

export const tableRow = style({
  display: 'table-row'
});

globalStyle(`${tableRow} > div`, {
  display: 'table-cell',
  position: 'relative',
  paddingTop: '14px',
  textAlign: 'center',
  height: 40
});

globalStyle(`${tableRow} > div:after`, {
  content: '',
  position: 'absolute',
  width: 20,
  height: 1,
  bottom: '15px',
  right: '-10px',
  transform: 'rotate(90deg)',
  backgroundImage: `linear-gradient(to right, ${vars.colors.grayDark} 50%, transparent 50%)`,
  backgroundPosition: 'left bottom, left bottom, left top, right top',
  backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
  backgroundSize: '5px 1px, 5px 1px, 1px 5px, 1px 5px'
});

globalStyle(`${tableRow} > div:last-child:after`, {
  display: 'none'
});

export const tableCell = style({
  display: 'table-cell',
  padding: '14px 8px',
  textAlign: 'center',
  position: 'relative',
  ':after': {
    content: '',
    position: 'absolute',
    width: 20,
    height: 1,
    top: '50%',
    right: '-10px',
    transform: 'rotate(90deg) translateY(-50%)',
    backgroundImage: `linear-gradient(to right, ${vars.colors.grayDark} 50%, transparent 50%)`,
    backgroundPosition: 'left bottom, left bottom, left top, right top',
    backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
    backgroundSize: '5px 1px, 5px 1px, 1px 5px, 1px 5px'
  }
});

globalStyle(`${tableCell}:last-child:after`, {
  display: 'none'
});
