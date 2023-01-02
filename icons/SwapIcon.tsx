import { vars } from 'styles/theme.css';

const SwapIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="35" height="35" rx="17.5" fill="transparent" />
    <path
      d="M17.8848 22.6718L20.1011 24.8865C20.2599 25.0378 20.5062 25.0378 20.6651 24.8865L22.8813 22.6718C23.1355 22.4249 22.9528 21.9947 22.6033 21.9947L21.1735 21.9947L21.1735 17.2069C21.1735 16.7687 20.816 16.4102 20.3791 16.4102C19.9422 16.4102 19.5847 16.7687 19.5847 17.2069L19.5847 21.9947L18.1628 21.9947C17.8054 21.9947 17.6306 22.4249 17.8848 22.6718V22.6718ZM15.3349 11.1125L13.1187 13.3272C12.8645 13.5742 13.0472 14.0044 13.3967 14.0044L14.8186 14.0044L14.8186 18.8001C14.8186 19.2383 15.1761 19.5968 15.613 19.5968C16.0499 19.5968 16.4073 19.2383 16.4073 18.8001L16.4073 14.0123L17.8292 14.0123C18.1867 14.0123 18.3614 13.5821 18.1072 13.3352L15.891 11.1205C15.7401 10.9612 15.4859 10.9612 15.3349 11.1125V11.1125Z"
      fill={vars.colors.text}
      fillOpacity="0.4"
    />
    <rect
      x="0.5"
      y="0.5"
      width="35"
      height="35"
      rx="17.5"
      stroke="#D9D9D9"
      strokeDasharray="6 6"
    />
  </svg>
);

export default SwapIcon;
