import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';
import { canceledIcon, executedIcon, failedIcon } from '../../styles/icons.css';

export const infoBlockContainer = style({
  display: 'flex',
  flexDirection: 'column'
});

export const disabled = style([
  {
    opacity: 0.4
  }
]);

export const status = style([
  typography.numbersLarge,
  {
    display: 'flex',
    alignItems: 'center'
  }
]);

export const executed = style({
  color: vars.colors.green,
});

export const failed = style({
  color: vars.colors.red,
});

export const canceled = style({
  color: vars.colors.black,
});

export const statusIcon = style({
  width: '20px',
  height: '20px',
  backgroundPosition: 'center',
  marginLeft: 4
});

export const statusExecutedIcon = style([executedIcon]);
export const statusCanceledIcon = style([canceledIcon]);
export const statusFailedIcon = style([failedIcon]);

export const label = style([
  typography.caption,
  {
    color: vars.colors.grayTransparent,
    selectors: {
      '&:not(:last-child)': { marginBottom: '4px' },
      '&:last-child': { marginTop: '4px' }
    }
  }
]);