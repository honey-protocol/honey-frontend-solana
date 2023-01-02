import {
  createGlobalTheme,
  createGlobalThemeContract
} from '@vanilla-extract/css';
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { Property } from 'csstype';
import TextTransform = Property.TextTransform;

export const vars = createGlobalThemeContract({
  colors: {
    brownLight: 'brownLight',
    brownMiddle: 'brownMiddle',
    brownDark: 'brownDark',

    secondaryBrownLight: 'secondaryBrownLight',
    secondaryBrownMiddle: 'secondaryBrownMiddle',

    grayLight: 'rywre',
    grayMiddle: 'rytrd',
    grayDark: 'drg',

    green: 'jkh',
    greenDark: 'greenDark',
    greenDarkest: 'greenDarkest',

    blue: 'hkjhlkjh',

    red: 'bkj',
    redDark: 'redDark',
    lightRedTransparent: 'lightRedTransparent',

    grayTransparent: 'grayTransparent',
    lightGrayTransparent: 'lightGrayTransparent',
    whiteTransparent: 'whiteTransparent',

    white: 'bhhioyigj',
    black: 'fdyjfghk',

    background: 'background',
    foreground: 'foreground',

    text: 'primary',
    textSecondary: 'secondary',
    textTertiary: 'tertiary',

    borderPrimary: 'primary-border',
    borderSecondary: 'secondary-border'
  },
  space: {
    none: 'adsj',
    small: 'fs',
    medium: 'q',
    large: 'fadsj'
  },
  width: {
    ['1/2']: 'kls',
    full: 'adsf'
  },
  shadow: {
    yellow: {
      boxShadow: `asdf`
    }
  }
});

const grayLight = '#F5F5F5';
const white = '#FFFFFF';
const black = '#111111';
const darkForeground = '#161b22';
createGlobalTheme('.honey-light-theme', vars, {
  colors: {
    brownLight: '#E7B400',
    brownMiddle: '#BE9200',
    brownDark: '#AA8300',

    secondaryBrownLight: '#FBF3D6',
    secondaryBrownMiddle: '#ECDFAF',

    grayLight,
    grayMiddle: '#E5E5E5',
    grayDark: '#D9D9D9',

    green: '#02AF00',
    greenDark: '#007700',
    greenDarkest: '#008800',

    blue: '#009EE7',

    red: '#CF4536',
    redDark: '#A62B1E',
    lightRedTransparent: 'rgba(166, 43, 30, 0.1)',

    grayTransparent: 'rgba(17, 17, 17, 0.4)',
    lightGrayTransparent: 'rgba(0, 0, 0, 0.12)',
    whiteTransparent: 'rgba(255, 255, 255, 0.7)',

    white,
    black: '#111111',
    foreground: white,
    background: grayLight,
    text: black,
    textSecondary: 'rgba(0, 0, 0, 0.85)',
    textTertiary: 'rgba(0, 0, 0, 0.4)',
    borderPrimary: black,
    borderSecondary: 'rgba(0, 0, 0, 0.12)'
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

createGlobalTheme('.honey-dark-theme', vars, {
  colors: {
    brownLight: '#E7B400',
    brownMiddle: '#BE9200',
    brownDark: '#AA8300',

    secondaryBrownLight: '#524B32',
    secondaryBrownMiddle: '#ECDFAF',

    grayLight,
    grayMiddle: '#3A3A3A',
    grayDark: '#D9D9D9',

    green: '#02AF00',
    greenDark: '#007700',
    greenDarkest: '#008800',

    blue: '#009EE7',

    red: '#CF4536',
    redDark: '#A62B1E',
    lightRedTransparent: 'rgba(166, 43, 30, 0.1)',

    grayTransparent: 'rgba(17, 17, 17, 0.4)',
    lightGrayTransparent: 'rgba(0, 0, 0, 0.12)',
    whiteTransparent: 'rgba(255, 255, 255, 0.7)',

    white,
    black,
    foreground: darkForeground,
    background: '#0d1116',
    text: white,
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textTertiary: 'rgba(255, 255, 255, 0.4)',
    borderPrimary: grayLight,
    borderSecondary: 'rgba(255, 255, 255, 0.5)'
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
  pageTitle: {
    fontFamily: 'Scandia',
    fontWeight: '500',
    fontSize: '32px',
    lineHeight: '38px',
    color: vars.colors.text
  },
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
