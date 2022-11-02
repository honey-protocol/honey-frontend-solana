import Link from 'antd/lib/typography/Link';
import React from 'react';
import * as styles from './HoneyLink.css';
import { HoneyLinkProps } from './type';

const HoneyLink = (props: HoneyLinkProps) => {
  const { children, link, target } = props;

  return (
    <Link className={styles.link} href={link} target={target}>
      {children}
    </Link>
  );
};

export default HoneyLink;