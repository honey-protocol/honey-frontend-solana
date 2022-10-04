import { style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from './theme.css';
import { honeyTableExpandedRow } from '../components/HoneyTable/HoneyTable.css';
import {
  pageTitle as pageTitleCommon,
  pageDescription as pageDescriptionCommon
} from './common.css';

import {
  arrowRightIcon,
  checkIcon,
  clockIcon,
  errorBlackIcon,
  errorRedIcon,
  lampIcon,
  penIcon
} from './icons.css';

export const draftToggle = style({
  display: 'flex',
  alignItems: 'flex-end',
  height: '100%'
});

export const toggle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end'
});

export const toggleText = style([
  typography.button,
  {
    marginLeft: 12
  }
]);

export const nameCell = style({
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden'
});

export const logoWrapper = style({
  marginRight: 12
});

export const collectionLogo = style({
  width: '34px',
  height: '34px',
  minWidth: '34px',
  flexShrink: 0
});

export const statusIcon = style({
  width: '100%',
  height: '100%',
  backgroundPosition: 'center'
});

export const statusCheckIcon = style([checkIcon]);
export const statusWaitIcon = style([clockIcon]);
export const statusDraftIcon = style([penIcon]);
export const statusErrorBlackIcon = style([errorBlackIcon]);
export const statusErrorRedIcon = style([errorRedIcon]);

export const lampIconStyle = style([
  lampIcon,
  {
    width: 32,
    height: 32,
    backgroundColor: vars.colors.white
  }
]);

export const collectionName = style([
  typography.body,
  {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
]);

export const pageTitle = style([pageTitleCommon]);

export const pageDescription = style([
  {
    color: vars.colors.grayTransparent,
    marginBottom: 0
  },
  pageDescriptionCommon
]);

export const buttonsCell = style({
  display: 'flex',
  justifyContent: 'center',
  '@media': {
    [`screen and (min-width: ${breakpoints.tablet}px)`]: {
      justifyContent: 'flex-end'
    }
  }
});

export const arrowIcon = style([
  arrowRightIcon,
  {
    width: 20,
    height: 20,
    transition: 'all .3s',
    selectors: {
      [`${honeyTableExpandedRow} &`]: {
        transform: 'rotate(-180deg)'
      }
    }
  }
]);

export const textTablet = style([
  typography.numbersRegular,
  {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
]);

export const textTabletTitle = style([
  typography.button,
  {
    color: vars.colors.grayTransparent,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end'
  }
]);

export const create = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 16,
  borderRadius: 12,
  backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
  backgroundSize: '2px 100%, 100% 2px, 2px 100%, 100% 2px',
  backgroundRepeat: 'no-repeat',
  backgroundImage: `repeating-linear-gradient(0deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(90deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(180deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(270deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px)`,
  borderImage: `repeating-linear-gradient(0deg, ${vars.colors.grayDark}, ${vars.colors.grayDark} 10px, transparent 10px, transparent 20px)`
});

export const selectedProposal = style({});
