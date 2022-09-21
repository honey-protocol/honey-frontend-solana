import { createVar, globalStyle, keyframes, style } from '@vanilla-extract/css';

export const mobileMenu = style({
  listStyle: 'none',
  padding: '30px 35px',
  gap: '22px',
  display: 'flex',
  flexDirection: 'column'
});

export const visible = style({});

export const hidden = style({});

export const animateIn = keyframes({
  '0%': {
    opacity: 0,
    transform: 'scale(0.9) translateX(-20px)'
  },
  '100%': {
    opacity: 1
  }
});

export const animateOut = keyframes({
  '0%': {
    opacity: 1
  },
  '100%': {
    opacity: 0,
    transform: 'scale(0.9) translateX(-20px)'
  }
});

export const linkOrder = createVar();

export const link = style({
  animationFillMode: 'both',
  animationTimingFunction: 'ease-in-out',
  animationDelay: `calc(${linkOrder} * 70ms)`,
  opacity: '0'
});

globalStyle(`${visible} ${link}`, {
  animationName: animateIn,
  animationDuration: '200ms'
});

globalStyle(`${hidden} ${link}`, {
  animationName: animateOut,
  animationDuration: '100ms'
});

export const activeLink = style({});

globalStyle(`${activeLink} a`, {
  opacity: 1
});

export const socialLinks = style({
  display: 'flex',
  gap: '25px',
  alignItems: 'center'
});

globalStyle(`${socialLinks} svg`, {
  opacity: '0.4'
});
