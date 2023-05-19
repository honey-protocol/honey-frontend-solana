import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const borrowForm = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: vars.colors.foreground,
  padding: 16
});

const formSection = style([
  {
    marginBottom: '24px'
  }
]);

export const row = style([
  formSection,
  {
    display: 'flex'
  }
]);

export const col = style({
  flex: '100% 0 0',
  paddingRight: 8
});

export const nftInfo = style([
  formSection,
  row,
  {
    alignItems: 'center',
    cursor: 'pointer',
    borderBottom: `2px solid ${vars.colors.borderSecondary}`,
    paddingBottom: 10
  }
]);
export const nftImage = style([
  {
    minWidth: 46,
    height: 46,
    marginRight: 15
  }
]);

export const nftNameContainer = style({
  flex: 'auto',
  display: 'grid'
});
export const nftName = style([
  typography.title,
  {
    fontSize: 20,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
]);

export const collateralDetails = style([
  typography.caption,
  {
    color: vars.colors.textTertiary
  }
]);

export const arrowRightIcon = style({
  marginLeft: 'auto',
  background: 'url(/images/arrow-right.svg) center no-repeat',
  width: 20,
  height: 20
});

export const cancelIcon = style({
  background:
    'url("/images/close-notification-icon.svg") center center no-repeat',
  width: 20,
  height: 20
});

export const inputs = style([
  {
    paddingTop: 16,
    backgroundImage: `linear-gradient(to right, ${vars.colors.borderPrimary} 50%, transparent 50%)`,
    backgroundPosition: 'left top, left bottom, left top, right top',
    backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
    backgroundSize: '20px 2px, 20px 2px, 2px 20px, 2px 20px',
    marginBottom: 16
  }
]);

export const buttons = style([
  {
    display: 'flex'
  }
]);

export const smallCol = style([
  {
    flex: '0 0 auto',
    marginRight: '12px'
  }
]);

export const bigCol = style([
  {
    flex: '1 0 auto'
  }
]);

// NEW BORROWING FORM

export const newBorrowingTitle = style([
  typography.title,
  {
    marginBottom: 18
  }
]);

export const borrowTopbar = style([
  {
    display: 'flex'
  }
]);

export const borrowUpto = style([
  typography.caption,
  {
    marginBottom: 18,
    color:  vars.colors.textTertiary,
    fontSize: 14,
    marginRight: 5 
  }
]);

export const borrowAmount = style([
  typography.caption,
  {
    marginBottom: 18,
    color:  vars.colors.textTertiary,
    fontSize: 14
  }
]);


export const collateralList = style({
  display: 'flex',
  flexDirection: 'column'
});
