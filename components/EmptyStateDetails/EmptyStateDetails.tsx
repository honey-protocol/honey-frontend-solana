import HoneyButton, {
  HoneyButtonProps
} from 'components/HoneyButton/HoneyButton';
import React, { ReactNode } from 'react';
import * as styles from './EmptyStateDetails.css';
import { Typography } from 'antd';
import cs from 'classnames';

interface button extends HoneyButtonProps {
  title: string;
}
interface EmptyStateDetailsProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttons?: button[];
}

const { Text } = Typography;
const EmptyStateDetails = (props: EmptyStateDetailsProps) => {
  return (
    <div className={styles.emptyStateContent}>
      {props.icon}
      <Text className={styles.emptyStateTitle}>{props.title}</Text>
      <Text type="secondary" className={styles.emptyStateDescription}>
        {props.description}
      </Text>
      {props.buttons &&
        props.buttons.map((button, i) => (
          <HoneyButton
            {...button}
            key={i}
            type="primary"
            className={cs(styles.emptyStateWalletBtn, button.className)}
          >
            {button.title}
          </HoneyButton>
        ))}
    </div>
  );
};

export default EmptyStateDetails;
