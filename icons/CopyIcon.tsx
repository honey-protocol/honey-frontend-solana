import { vars } from 'styles/theme.css';

export const CopyIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 9H1.5C1.26 9 1 8.8105 1 8.5V1.5C1 1.2595 1.19 1 1.5 1H8.5C8.8105 1 9 1.261 9 1.5V3H10.5C10.8105 3 11 3.261 11 3.5V10.5C11 10.8105 10.739 11 10.5 11H3.5C3.26 11 3 10.8105 3 10.5V9ZM3.75 3.75V10.25H10.25V3.75H3.75ZM8.25 3V1.75H1.75V8.25H3V3.5C3 3.2595 3.19 3 3.5 3H8.25Z"
      fill={vars.colors.text}
    />
  </svg>
);
