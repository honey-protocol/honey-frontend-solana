import React from 'react';
import { vars } from 'styles/theme.css';

const SorterIcon = (props: { active: boolean }) => (
  <svg
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3.5"
      y="5"
      width="6"
      height="2"
      rx="1"
      fill={props.active ? vars.colors.brownLight : vars.colors.text}
    />
    <rect
      x="3.5"
      y="9"
      width="10"
      height="2"
      rx="1"
      fill={props.active ? vars.colors.brownLight : vars.colors.text}
    />
    <rect
      x="3.5"
      y="13"
      width="14"
      height="2"
      rx="1"
      fill={props.active ? vars.colors.brownLight : vars.colors.text}
    />
  </svg>
);

export default SorterIcon;
