import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const dialectNotification = style({
  width: 195,
  height: 20
});

// indicator dot style
globalStyle(
  `${dialectNotification} .dialect dt-relative.dt-flex.dt-items-center.dt-justify-center.dt-rounded-full button`,
  {
    background: vars.colors.red,
    left: 12
  }
);

// indicator dot style
globalStyle(
  `${dialectNotification} .dialect .dt-absolute.dt-h-3.dt-w-3.dt-z-50.dt-rounded-full.dt-bg-accent.dt-text-white`,
  {
    background: vars.colors.brownLight,
    left: 12
  }
);

const popoverSelector = `${dialectNotification} .dialect .dialect > .dt-fixed`;

globalStyle(`${popoverSelector}`, {
  maxWidth: 360,
  height: 'calc(100vh - 120px)',
  pointerEvents: 'all',
  '@media': {
    [`screen and (max-width: ${breakpoints.mobile}px)`]: {
      maxWidth: 'unset',
      height: '100vh',
      left: 0
    }
  }
});

globalStyle(`${popoverSelector} .dt-flex-row`, {
  padding: '14px 14px 16px 16px',
  border: 'none',
  color: vars.colors.text,
  maxHeight: 'initial',
  minHeight: 0
});

globalStyle(`${popoverSelector} *`, {
  fontFamily: 'Scandia !important',
  fontWeight: '500',
  fontSize: '14px',
  lineHeight: '20px',
  color: vars.colors.text
});

//date text style
globalStyle(`${popoverSelector} .dt-text-right > p`, {
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'left'
});

globalStyle(`${popoverSelector} label`, {
  ...typography.caption
});

globalStyle(`${popoverSelector} input`, {
  border: 'none'
});

globalStyle(`${popoverSelector} button`, {
  ...typography.button,
  fontFamily: 'Red Hat Mono !important',
  borderRadius: '8px',
  height: 'unset',
  display: 'flex',
  // display: 'inline-flex',
  padding: '0 !important',
  border: 'none',
  gap: '10px',
  transition: 'all .5s',
  justifyContent: 'center',
  alignItems: 'center',
  background: vars.colors.brownLight,
  color: `${vars.colors.black} !important`
});

globalStyle(`${popoverSelector} button:not(:has(svg))`, {
  padding: '7px !important'
});

globalStyle(`${popoverSelector} button svg`, {
  width: 40,
  height: 'auto',
  background: vars.colors.foreground,
  borderRadius: 8,
  padding: 7
});

globalStyle(`${popoverSelector} input[type="checkbox"] + span`, {
  background: vars.colors.secondaryBrownMiddle
});

globalStyle(`${popoverSelector} .dt-flex-row > .dt-text-base`, {
  ...typography.title,
  color: vars.colors.text
});

globalStyle(`${popoverSelector} .dialect > .dt-flex > .dt-h-full`, {});

globalStyle(`${popoverSelector} .dt-bg-white`, {
  boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`,
  border: `2px solid ${vars.colors.borderPrimary}`,
  background: vars.colors.foreground
});

globalStyle(`${dialectNotification} .dialec > div`, {
  position: 'static'
});
