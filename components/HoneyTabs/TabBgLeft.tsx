import classNames from 'classnames';
import React from 'react';
import { vars } from 'styles/theme.css';
import * as styles from './HoneyTabs.css';

const TabBgLeft = (props: { active: boolean }) => {
  return (
    <div className={classNames(styles.tabSvg, styles.svgRight)}>
      <svg
        width="364"
        height="56"
        viewBox="0 0 364 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_1473_6030)">
          <path
            d="M162.397 0H14.7507C8.56859 0 3.39819 4.69661 2.80586 10.8502L0 40V52H360C360 45.3726 354.627 40 348 40H189.913C184.159 40 179.215 35.9159 178.128 30.2656L174.181 9.73441C173.095 4.08405 168.151 0 162.397 0Z"
            fill="white"
          />
          <path
            d="M14.7507 1H162.397C167.671 1 172.203 4.74372 173.199 9.92321L177.146 30.4544C178.323 36.5756 183.679 41 189.913 41H348C353.738 41 358.45 45.3935 358.955 51H1V40.048L3.80126 10.946C4.34423 5.30522 9.08376 1 14.7507 1Z"
            stroke={props.active ? '#111111' : vars.colors.grayDark}
            strokeWidth="2"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_1473_6030"
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
              result="effect1_dropShadow_1473_6030"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1473_6030"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default TabBgLeft;
