import classNames from 'classnames';
import React from 'react';
import { vars } from 'styles/theme.css';
import * as styles from './HoneyTabs.css';

const TabBgRight = (props: { active: boolean }) => (
  <div className={classNames(styles.tabSvg, styles.svgRight)}>
    <svg
      width="364"
      height="56"
      viewBox="0 0 364 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_1470_3642)">
        <path
          d="M345.249 0H197.603C191.849 0 186.905 4.08406 185.819 9.73441L181.872 30.2656C180.785 35.9159 175.841 40 170.087 40H12C5.37258 40 0 45.3726 0 52H360V40L357.194 10.8502C356.602 4.69662 351.431 0 345.249 0Z"
          fill="white"
        />
        <path
          d="M197.603 1H345.249C350.916 1 355.656 5.30524 356.199 10.9461L359 40.0479V51H1.04484C1.55007 45.3935 6.26196 41 12 41H170.087C176.321 41 181.677 36.5756 182.854 30.4544L186.801 9.92321C187.797 4.74372 192.329 1 197.603 1Z"
          stroke={props.active ? '#111111' : vars.colors.grayDark}
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_1470_3642"
          x="0"
          y="0"
          width="364"
          height="56"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset
            dx={props.active ? '4' : '2'}
            dy={props.active ? '4' : '2'}
          />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values={
              props.active
                ? '0 0 0 0 0.905882 0 0 0 0 0.7052 0 0 0 0 0 0 0 0 1 0'
                : '0 0 0 0 0.879167 0 0 0 0 0.860851 0 0 0 0 0.860851 0 0 0 1 0'
            }
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1470_3642"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1470_3642"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  </div>
);

export default TabBgRight;
