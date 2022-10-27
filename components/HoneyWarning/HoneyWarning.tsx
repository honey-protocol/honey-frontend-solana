import Link from 'antd/lib/typography/Link';
import React, { ReactNode } from 'react';
import * as styles from './HoneyWarning.css';
import cs from 'classnames';

interface HoneyWarningProps {
  message: string;
  danger?: boolean;
  link?: string;
  children?: ReactNode;
}

const HoneyWarning = (props: HoneyWarningProps) => {
  return (
    <div
      className={cs(styles.warning, { [styles.warningDanger]: props.danger })}
    >
      {props.link ? (
        <Link href={props.link} target="_blank" className={styles.warningLink}>
          <p
            className={cs(styles.warningTitle, {
              [styles.warningDangerTitle]: props.danger
            })}
          >
            {props.message}
          </p>
          <div className={styles.warningLinkIcon} />
        </Link>
      ) : (
        <>
          <p
            className={cs(styles.warningTitle, {
              [styles.warningDangerTitle]: props.danger
            })}
          >
            {props.message}
          </p>
          {props.children}
        </>
      )}
    </div>
  );
};

export default HoneyWarning;
