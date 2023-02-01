import { vars } from 'styles/theme.css';

export const MenuCloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1.25L19 19.25M19 1.25L1 19.25"
      stroke={vars.colors.text}
      strokeWidth="1.8"
    />
  </svg>
);
