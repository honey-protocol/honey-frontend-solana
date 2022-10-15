import { style } from '@vanilla-extract/css';

export const logoIcon = style({
  background: 'url("/images/HoneyLogoIcon.svg") center no-repeat'
});

export const lampIcon = style({
  background: 'url(/images/lamp.svg) center no-repeat',
  height: '100%',
  width: '100%'
});

export const questionIcon = style({
  width: 12,
  height: 12,
  background: 'url("/images/question.svg") center center no-repeat'
});

export const questionIconYellow = style([
  questionIcon,
  {
    background: 'url("/images/question-yellow.svg") center center no-repeat'
  }
]);

export const arrowRightIcon = style({
  background: 'url(/images/arrow-right.svg) center no-repeat'
});

export const checkIcon = style({
  background: 'url(/images/Check.svg) center no-repeat'
});

export const clockIcon = style({
  background: 'url(/images/Clock.svg) center no-repeat'
});

export const penIcon = style({
  background: 'url(/images/Pen.svg) center no-repeat'
});

export const errorBlackIcon = style({
  background: 'url(/images/error-black.svg) center no-repeat'
});

export const errorRedIcon = style({
  background: 'url(/images/error-red.svg) center no-repeat'
});
