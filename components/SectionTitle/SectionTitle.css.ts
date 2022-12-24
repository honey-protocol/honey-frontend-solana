import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const sectionTitle = style([
  typography.title,
  {
    color: vars.colors.text,
    display: 'flex',
    alignItems: 'center'
  }
]);
