import { style } from '@vanilla-extract/css';
import {typography, vars} from "../../styles/theme.css";

export const warning = style({
    backgroundColor: vars.colors.secondaryBrownLight,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
});

export const warningTitle = style([
    typography.caption,
    {
        width: 'calc(100% - 16px)',
        color: vars.colors.brownMiddle,
        marginBottom: 0
    }
]);

export const warningIcon = style({
    width: 12,
    height: 12,
    background: 'no-repeat center/contain url("/images/newPage.svg")',
});