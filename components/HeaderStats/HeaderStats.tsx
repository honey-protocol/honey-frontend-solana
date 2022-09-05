import React from 'react';
import { Progress, Space, Typography } from 'antd';
import * as styles from './HeaderStats.css';
import { vars } from 'styles/theme.css';
import { BarPinItemIcon } from 'icons/BarPinItemIcon';
const { Title, Paragraph, Text, Link } = Typography;

const HeaderStats = () => {
  return (
    <Space size="middle" className={styles.headerStats}>
      <Space align="end" size={2} direction="vertical">
        <Text className={styles.num}>$ 1,250</Text>
        <Text className={styles.caption}>Debt</Text>
      </Space>
      <div className={styles.statsContainer}>
        <div className={styles.progressBarWrapperWithPin}>
          <Progress
            strokeWidth={5}
            showInfo={false}
            percent={100}
            strokeColor={vars.colors.green}
          />
          <div className={styles.pinContainer}>
            <BarPinItemIcon color={vars.colors.green} />
          </div>
        </div>
        <Space>
          <Text className={styles.num}>
            20 %{' '}
            <Text type="secondary" className={styles.caption}>
              Risk
            </Text>
          </Text>
        </Space>
      </div>
      <div className={styles.statsContainer} style={{ minWidth: '170px' }}>
        <div className={styles.progressBarWrapperWithPin}>
          <Progress
            strokeWidth={5}
            showInfo={false}
            percent={100}
            strokeColor="black"
            className={styles.progressBarWithPin}
          />
          <div className={styles.pinContainer}>
            <BarPinItemIcon color={'black'} />
          </div>
        </div>
        <Text className={styles.num}>
          $ 2,250{' '}
          <Text type="secondary" className={styles.caption}>
            Available
          </Text>
        </Text>
      </div>

      <div className={styles.statsContainer} style={{ minWidth: '50px' }}>
        <Progress
          strokeWidth={5}
          showInfo={false}
          percent={100}
          strokeColor={vars.colors.grayMiddle}
        />

        <Text style={{ color: 'transparent' }}>{`.`}</Text>
      </div>
      <div className={styles.statsContainer} style={{ minWidth: '100px' }}>
        <Progress
          strokeWidth={5.3}
          showInfo={false}
          percent={100}
          strokeColor={vars.colors.grayMiddle}
        />
        <Text type="secondary" className={styles.caption}>
          Liquidation
        </Text>
      </div>
      <Space size={2} direction="vertical">
        <Text className={styles.num}>$ 5,000</Text>
        <Text type="secondary" className={styles.caption}>
          Deposit
        </Text>
      </Space>
    </Space>
  );
};

export default HeaderStats;
