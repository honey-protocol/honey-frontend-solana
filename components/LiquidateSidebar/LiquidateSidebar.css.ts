import { style } from '@vanilla-extract/css';
import { typography, vars } from 'styles/theme.css';

export const liquidateSidebarContainer = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
});

export const tabs = style({});

export const content = style({
    borderRadius: vars.space.medium,
    overflow: 'hidden',
    background: vars.colors.white,
    minHeight: 756,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
});

export const inactive = style({
    boxShadow: `2px 2px 0px 0px ${vars.colors.grayDark}`,
    border: `2px solid ${vars.colors.grayDark}`,
    background: 'transparent'
});
export const active = style({
    boxShadow: `4px 4px 0px 0px ${vars.colors.brownLight}`,
    border: `2px solid ${vars.colors.black}`
});

export const emptyStateContent = style({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
});

export const boltIcon = style({
    width: 52,
    height: 52,
    background: 'url("/images/boltIcon.svg") center center no-repeat'
});

export const lightIcon = style({
    width: 52,
    height: 52,
    background: 'url("/images/lightIcon.svg") center center no-repeat'
});

export const emptyStateTitle = style([
    typography.body,
    {
        marginTop: 10,
        marginBottom: 4
    }
]);

export const emptyStateDescription = style([
    typography.description,
    {
        fontWeight: '500'
    }
]);

export const emptyStateWalletBtn = style({
    marginTop: 12
});
