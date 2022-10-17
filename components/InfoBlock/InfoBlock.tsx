import { ReactElement, FC, Fragment, ReactNode } from 'react';
import * as styles from './InfoBlock.css';
import c from 'classnames';
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';

interface InfoBlockProps {
  title?: string | ReactElement;
  valueColor?: 'green';
  value: string | ReactElement;
  footer?: ReactElement;
  valueSize?: 'normal' | 'big';
  isDisabled?: boolean;
  toolTipLabel?: string | ReactElement;
}

export const InfoBlock: FC<InfoBlockProps> = ({
  title,
  value,
  footer,
  valueSize = 'normal',
  isDisabled,
  toolTipLabel,
  valueColor
}) => {
  const Container = (a: { children: ReactNode }) =>
    toolTipLabel ? (
      <HoneyTooltip label={toolTipLabel}>{a.children}</HoneyTooltip>
    ) : (
      <Fragment>{a.children}</Fragment>
    );
  return (
    <Container>
      <div
        className={c(styles.infoBlockContainer, {
          [styles.disabled]: isDisabled
        })}
      >
        {title && (
          <div
            className={c(styles.label, valueColor ? styles[valueColor] : '')}
          >
            {title}
          </div>
        )}
        <div
          className={c(
            styles.value[valueSize],
            valueColor ? styles[valueColor] : ''
          )}
        >
          {value}
        </div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </Container>
  );
};
