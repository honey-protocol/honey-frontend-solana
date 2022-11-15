import React, { ReactNode } from 'react';
import * as styles from './SectionTitle.css';
import c from 'classnames';

interface SectionTitleProps {
  title: string;
  className?: string;
  tooltip?: ReactNode;
}

const SectionTitle = (props: SectionTitleProps) => {
  return (
    <div className={c(styles.sectionTitle, props.className)}>
      {props.title} {props.tooltip}
    </div>
  );
};

export default SectionTitle;
