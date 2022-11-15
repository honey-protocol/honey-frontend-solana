import { style } from '@vanilla-extract/css';
import { sidebar } from '../../styles/common.css';

export const BorrowP2PSidebar = style([
  sidebar,
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%'
  }
]);

export const boltIcon = style({
  width: 52,
  height: 52,
  background: 'url("/images/boltIcon.svg") center center no-repeat'
});

export const lightIcon = style({
  width: 52,
  height: 52,
  background: 'url("/images/lightIcon.svg") center center no-repeat'
});
