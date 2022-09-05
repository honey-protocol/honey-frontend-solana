import {ReactElement, FC} from "react";
import * as styles from './InfoBlock.css';

interface Props {
  title?: string;
  value: string;
  footer?: ReactElement;
  valueSize?: 'default' | 'big'
}

export const InfoBlock: FC<Props> = ({ title, value, footer, valueSize = 'default'}) => {
  return <div className={styles.infoBlockContainer}>
    {title && <div className={styles.labelsText}>{title}</div>}
    <div className={styles.valueText[valueSize]}>{value}</div>
    {footer && <div className={styles.labelsText}>{footer}</div>}
  </div>
}