import Link from 'antd/lib/typography/Link';
import React from 'react';
import * as styles from './HoneyWarning.css';

interface HoneyWarningProps {
  message: string,
  link?: string
}

const HoneyWarning = (props: HoneyWarningProps) => {
  return (
    <div className={styles.warning}>
      {props.link ?
        <Link href={props.link} target='_blank' className={styles.warningLink}>
          <p className={styles.warningTitle}>{props.message}</p>
          <div className={styles.warningLinkIcon} />
        </Link>
        :
        <p className={styles.warningTitle}>{props.message}</p>
      }
    </div>
  );
};

export default HoneyWarning;
