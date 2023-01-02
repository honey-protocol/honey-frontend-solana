import { style, styleVariants } from '@vanilla-extract/css';
import { sidebar } from '../../../styles/common.css';
import { typography, vars } from '../../../styles/theme.css';

export const LoansList = style([
  sidebar,
  {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: `16px 0 0 0`
  }
]);

export const loan = styleVariants({
  section: {
    display: 'flex',
    cursor: 'pointer',
    padding: `16px`,
    borderBottom: `1px solid dashed`,
    selectors: {
      '&:hover': {
        background: vars.colors.background
      }
    }
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    flex: `1 0 auto`,
    marginRight: 20
  },
  image: {
    width: 34,
    height: 34,
    marginRight: 15
  },
  title: {
    ...typography.description,
    marginBottom: 8
  },
  arrow: {
    width: 7
  }
});

export const loanStats = styleVariants({
  section: {
    width: `100%`,
    flex: `1 0 auto`
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 8px',
    borderRadius: 4,
    selectors: {
      '&:nth-child(even)': {
        background: vars.colors.background
      }
    }
  },
  label: {
    ...typography.caption,
    color: vars.colors.textTertiary
  },
  value: {
    ...typography.caption
  }
});

export const selected = style([{}]);
