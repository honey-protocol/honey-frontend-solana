import { ReactElement, FC } from 'react';
import * as styles from './InfoBlock.css';
import c from 'classnames';

interface InfoBlockProps {
  title?: string;
  value: string;
  footer?: ReactElement;
  valueSize?: 'normal' | 'big';
  isDisabled?: boolean;
}

export const InfoBlock: FC<InfoBlockProps> = ({
  title,
  value,
  footer,
  valueSize = 'normal',
  isDisabled
}) => {
  return (
    <div
      className={c(styles.infoBlockContainer, {
        [styles.disabled]: isDisabled
      })}
    >
      {title && <div className={styles.label}>{title}</div>}
      <div className={styles.value[valueSize]}>{value}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};
