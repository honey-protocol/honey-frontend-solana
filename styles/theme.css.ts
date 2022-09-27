import { createGlobalTheme } from '@vanilla-extract/css';
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { Property } from 'csstype';
import TextTransform = Property.TextTransform;

export const vars = createGlobalTheme(':root', {
  colors: {
    brownLight: '#E7B400',
    brownMiddle: '#BE9200',
    brownDark: '#AA8300',

    secondaryBrownLight: '#FBF3D6',
    secondaryBrownMiddle: '#ECDFAF',

    grayLight: '#F5F5F5',
    grayMiddle: '#E5E5E5',
    grayDark: '#D9D9D9',

    green: '#02AF00',
    greenDark: '#007700',
    greenDarkest: '#008800',

    red: '#CF4536',
    redDark: '#A62B1E',

    grayTransparent: 'rgba(17, 17, 17, 0.4)',
    lightGrayTransparent: 'rgba(0, 0, 0, 0.12)',
    whiteTransparent: 'rgba(255, 255, 255, 0.7)',

    white: '#FFFFFF',
    black: '#111111'
  },
  space: {
    none: '0',
    small: '8px',
    medium: '16px',
    large: '32px'
  },
  width: {
    ['1/2']: '50%',
    full: '100%'
  },
  shadow: {
    yellow: {
      boxShadow: `4px 4px 0px 0px #FBF3D6`
    }
  }
});

export const typography = {
  title: {
    fontFamily: 'Scandia',
    fontWeight: '500',
    fontSize: '22px',
    lineHeight: '26px'
  },
  body: {
    fontFamily: 'Scandia',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '20px'
  },
  description: {
    fontFamily: 'Scandia',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px'
  },
  caption: {
    fontFamily: 'Scandia',
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '14px'
  },
  button: {
    fontFamily: 'Red Hat Mono',
    fontWeight: '500',
    fontSize: '14px',
    textTransform: 'uppercase' as TextTransform,
    lineHeight: '20px'
  },
  numbersLarge: {
    fontFamily: 'Red Hat Mono',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '26px'
  },
  numbersRegular: {
    fontFamily: 'Red Hat Mono',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '20px'
  },
  numbersMini: {
    fontFamily: 'Red Hat Mono',
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '14px'
  }
};

export const breakpoints = {
  mobile: 845,
  tablet: 846,
  desktop: 1240
};

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'flex', 'block', 'inline'],
    flexDirection: ['row', 'column'],
    width: vars.width,
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between'
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space
    // etc.
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    placeItems: ['justifyContent', 'alignItems']
  }
});

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: 'lightMode',
  properties: {
    color: vars.colors,
    background: vars.colors,
    anyanother: {}
    // etc.
  }
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);
export type Sprinkles = Parameters<typeof sprinkles>[0];
