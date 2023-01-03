import { ReactElement, FC, Fragment, ReactNode } from 'react';
import * as styles from './InfoBlock.css';
import c from 'classnames';
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';
import Image from 'next/image';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';

interface InfoBlockProps {
  title?: string | ReactElement;
  valueColor?: 'green';
  value: string | ReactElement;
  footer?: ReactElement;
  valueSize?: 'normal' | 'big';
  isDisabled?: boolean;
  toolTipLabel?: string | ReactElement;
  className?: string;
  center?: boolean;
}

export const InfoBlock: FC<InfoBlockProps> = ({
  title,
  value,
  footer,
  valueSize = 'normal',
  isDisabled,
  toolTipLabel,
  valueColor,
  center,
  className
}) => {
  const Container = (a: { children: ReactNode }) =>
    toolTipLabel ? (
      <HoneyTooltip title={toolTipLabel}>{a.children}</HoneyTooltip>
    ) : (
      <Fragment>{a.children}</Fragment>
    );
  return (
    <Container>
      <div
        className={c(styles.infoBlockContainer, className, {
          [styles.disabled]: isDisabled,
          [styles.center]: center
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
            valueColor ? styles[valueColor] : '',
            styles.wrapThis
          )}
        >
          <div className={styles.logoWrapper}>
            <div className={styles.collectionLogo}>
              <HexaBoxContainer>
                <Image
                  src={
                    'https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I'
                  }
                  alt={`BONK NFT image`}
                  layout="fill"
                />
              </HexaBoxContainer>
            </div>
          </div>
          {value}
        </div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </Container>
  );
};
