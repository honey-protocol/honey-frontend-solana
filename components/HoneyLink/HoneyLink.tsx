import Link from 'antd/lib/typography/Link';
import React from 'react';
import * as styles from './HoneyLink.css';
import { HoneyLinkProps } from './type';
import c from 'classnames';

const HoneyLink = (props: HoneyLinkProps) => {
  const { children, link, target, className } = props;

  return (
    <Link className={c(styles.link, className)} href={link} target={target}>
      {children}
    </Link>
  );
};

export default HoneyLink;