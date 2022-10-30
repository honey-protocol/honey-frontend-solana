import { FC } from 'react';
import c from 'classnames';
import { Modal } from 'antd';
import * as styles from './HoneyModalRedesign.css';
import HoneyCardYellowShadow from '../HoneyCardYellowShadow/HoneyCardYellowShadow';
import { HoneyModalProps } from './types';

export const HoneyModalRedesign: FC<HoneyModalProps> = props => {
  const { className, children, ...modalProps } = props;

  return (
    <Modal
      {...modalProps}
      closeIcon={<div className={styles.closeIcon} />}
      className={c(styles.honeyModal, className)}
      centered
    >
      <HoneyCardYellowShadow>
        <div className={styles.modalContentWrapper}>{children}</div>
      </HoneyCardYellowShadow>
    </Modal>
  );
};
