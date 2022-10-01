import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const governanceDescription = style({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: vars.colors.white,
    padding: 16,
});

export const articleWrapper = style({
  display: "flex",
  flexDirection: "column",
  marginBottom: 24
})

export const articleTitle = style([typography.title, {
  color: vars.colors.black,
  marginBottom: 12
}])

export const articleDescription = style([typography.description, {
  color: vars.colors.black
}])
