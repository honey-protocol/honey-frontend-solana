export const BarPinItemIcon = (props: { color: string }) => (
  <svg
    width="11"
    height="5"
    viewBox="0 0 11 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.61798 4.58483L0.738445 1.81373C-0.0531862 1.24828 0.346844 0 1.31968 0H9.07875C10.0516 0 10.4516 1.24828 9.65999 1.81373L5.78046 4.58483C5.43276 4.83319 4.96568 4.83319 4.61798 4.58483Z"
      fill={props.color ? props.color : '#111111'}
    />
  </svg>
);
