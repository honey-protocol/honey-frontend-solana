import {style, styleVariants} from '@vanilla-extract/css';
import {typography, vars} from "../../../styles/theme.css";

export const borrowP2PSidebarFooter = styleVariants({
    footerContainer: {
      display: 'flex',
      width: '100%',
    },
    smallCol: {
      flex: '0 0 auto',
      marginRight: '12px'
    },
    bigCol: {
      flex: '1 0 auto'
    }
  }
)