import React from 'react';
import { vars } from 'styles/theme.css';

const SOLIcon = () => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.80005 0L0.800049 3H12.2L15.2 0H3.80005Z"
      fill={vars.colors.textSecondary}
    />
    <path
      d="M12.2 4.5H0.800049L3.80005 7.5H15.2L12.2 4.5Z"
      fill={vars.colors.textSecondary}
    />
    <path
      d="M15.2 9H3.80005L0.800049 12H12.2L15.2 9Z"
      fill={vars.colors.textSecondary}
    />
  </svg>
);

export default SOLIcon;
