import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const governanceDescription = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: 16
});

export const articleWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 24
});

export const markdown = style({});

globalStyle(
  `${markdown} h1, ${markdown} h2, ${markdown} h3, ${markdown} h4, ${markdown} h5`,
  {
    ...typography.title,
    color: vars.colors.text,
    marginBottom: 12
  }
);

globalStyle(`${markdown} p`, {
  ...typography.description,
  color: vars.colors.text
});

globalStyle(`${markdown} a`, {
  ...typography.description,
  color: vars.colors.brownMiddle
});

// export const articleDescription = style([typography.description, {}]);
