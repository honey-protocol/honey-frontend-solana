import { style } from '@vanilla-extract/css';
import { typography, vars } from '../../../styles/theme.css';

export const burnNftsForm = style({
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
  marginBottom: 12
})

export const articleTitle = style([typography.title, {
  color: vars.colors.black,
  marginBottom: 2
}])

export const articleDescription = style([typography.description, {
  color: vars.colors.grayTransparent
}])

const formSection = style([
  {
    marginBottom: '10px'
  }
]);

export const row = style([
  formSection,
  {
    display: 'flex'
  }
]);

export const col = style({
  flex: '100% 0 0'
});

export const buttons = style([
  {
    display: 'flex'
  }
]);

export const smallCol = style([
  {
    flex: '0 0 auto',
    marginRight: '12px'
  }
]);

export const bigCol = style([
  {
    flex: '1 0 auto'
  }
]);

export const list = style({
  display: "flex",
  flexDirection: "column"
})

export const listItem = style({
  display: "flex",
  justifyContent: "space-between",
  padding: '14px 0',
  alignItems: "center"
})

export const listItemLeft = style({
  display: "flex"
})
export const listItemIcon = style({
  width: 34,
  height: 34,
  flexShrink: 0,
  marginRight: 15
})
export const itemCollection = style( {
  display: "flex",
  flexDirection: "column"
})
export const itemCollectionName = style( [typography.caption, {
  color: vars.colors.grayTransparent,
  marginBottom: 2
}])
export const itemCollectionValue = style( {
  display: "flex",
  alignItems: "flex-end"
})
export const itemCollectionValueCount = style( [typography.numbersRegular, {
  color: vars.colors.black,
  marginRight: 4
}])
export const itemCollectionToken = style( [typography.caption, {
  color: vars.colors.black
}])
