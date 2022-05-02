import { style, globalStyle } from '@vanilla-extract/css';

export const headerWrapper = style({
    display: 'flex',
    justifyContent: 'space-between',
    background: 'rgb(20, 20, 20)',
    padding: '1em 2em',
    height: '8em',
    alignItems: 'center',
    borderRadius: '10px',
    marginTop: '2em',
});

globalStyle(`${headerWrapper} > div `, {
    fontSize: '1.2em',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '2em'
});

globalStyle(`${headerWrapper} > div > div > span `, {
    fontSize: '.8em',
    fontWeight: '600',
    color: 'rgb(48, 208, 88)',
    padding: '.25em',
    background: 'rgb(26, 58, 34)',
    borderRadius: '10px'
});