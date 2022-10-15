import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const rangeContainer = style({
    display: 'flex',
});

export const statusWrapper = style({
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',

    selectors: {
        '&:not(:last-child)': {
            marginRight: 4
        }
    }
});


export const statusWrapperSafeZone = style({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column-reverse',
    marginRight: 4
});

export const status = style([
    typography.numbersRegular,
    {
        padding: 0,
        margin: 0,
        marginTop: 4,
    }
]);

const statusChildSelector = (selector: string) => {
    return `${status} ${selector}`;
};
const scs = statusChildSelector;

globalStyle(scs(`> .ant-status-step > .ant-status-dot`), {
    display: 'none'
});
globalStyle(scs(`> .ant-status-mark`), {
    fontSize: 14,
    color: vars.colors.black
});
globalStyle(scs(`> .ant-status-mark > .ant-status-mark-text`), {
    color: vars.colors.black
});
globalStyle(scs(`> .ant-status-rail`), {
    backgroundColor: `${vars.colors.grayMiddle} !important`
});
globalStyle(scs(`> .ant-status-handle:focus`), {
    boxShadow: 'none'
});

export const disabledBackgroundstatus = style({});
globalStyle(`${disabledBackgroundstatus} > .ant-status-rail`, {
    background: `linear-gradient(-45deg, rgba(0, 0, 0, 0) 49.9%, ${vars.colors.black} 49.9%, ${vars.colors.black} 77%, rgba(0, 0, 0, 0) 43% ), linear-gradient(-45deg, red 10%, rgba(0, 0, 0, 0) 10% )`,
    backgroundSize: '8px 6px'
});

export const enabledWarningBackgroundstatus = style({});
globalStyle(`${enabledWarningBackgroundstatus} > .ant-status-track`, {
    background: `linear-gradient(-45deg, transparent 49.9%, ${vars.colors.brownMiddle} 49.9%, ${vars.colors.brownMiddle} 77%, transparent 43% ), linear-gradient(-45deg, ${vars.colors.brownMiddle} 10%, transparent 10% )`,
    backgroundSize: '8px 6px'
});

export const enabledBackgroundstatus = style({});
globalStyle(`${enabledBackgroundstatus} > .ant-status-track`, {
    background: `linear-gradient(-45deg, transparent 49.9%, ${vars.colors.greenDarkest} 49.9%, ${vars.colors.greenDarkest} 77%, transparent 43% ), linear-gradient(-45deg, ${vars.colors.greenDarkest} 10%, transparent 10% )`,
    backgroundSize: '8px 6px'
});

export const statusHeader = styleVariants({
    primary: [typography.numbersRegular, {
        whiteSpace: 'nowrap',
        lineHeight: '14px',
        fontSize: '12px',
    }],
    secondary: [
        typography.numbersRegular,
        {
            color: vars.colors.grayTransparent,
            textAlign: 'right',
            lineHeight: '14px',
            whiteSpace: 'nowrap',
            fontSize: '12px',
        }
    ],
    availableValue: [
        typography.numbersRegular,
        {
            textAlign: 'center',
            lineHeight: '14px',
            whiteSpace: 'nowrap',
            fontSize: '12px',
        }
    ]
});
