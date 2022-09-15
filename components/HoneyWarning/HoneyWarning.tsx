import Link from 'antd/lib/typography/Link';
import React from 'react';
import * as styles from './HoneyWarning.css';

interface HoneyWarningProps {
    message: string,
    link: string
}

const HoneyWarning = (props: HoneyWarningProps) => {
    return (
        <Link href={props.link} target="_blank" className={styles.warning}>
            <span className={styles.warningTitle}>{props.message}</span>
            <div className={styles.warningIcon} />
        </Link>
    );
};

export default HoneyWarning;
