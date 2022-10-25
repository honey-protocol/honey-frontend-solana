import Input from 'antd/lib/input';
import * as styles from './LiquidationMarketsStep.css';
import HoneyButton from '../HoneyButton/HoneyButton';
import { Typography } from 'antd';
import HoneyWarning from '../HoneyWarning/HoneyWarning';
import React, { useState } from 'react';
import HoneyLink from '../HoneyLink/HoneyLink';
import TabTitle from '../HoneyTabs/TabTitle/TabTitle';
import HoneyTooltip from '../HoneyTooltip/HoneyTooltip';
import c from 'classnames';

const { Text } = Typography;

type PoolType = {
  value: string;
  id: number;
};

const LiquidationMarketsStep = () => {
  const [poolAddress, setPoolAddress] = useState<string>('');
  const [pools, setPools] = useState<PoolType[]>([]);

  const handleClick = () => {
    setPools(prev => [
      ...prev,
      { value: poolAddress, id: prev.length ? prev[prev.length - 1].id + 1 : 0 }
    ]);
    setPoolAddress('');
  };

  return (
    <>
      <div className={styles.tabTitle}>
        <TabTitle
          title="Liquidation markets"
          tooltip={<HoneyTooltip tooltipIcon placement="top" label={'Mock'} />}
        />
      </div>

      <div className={styles.liquidationInputBlock}>
        <Input
          className={styles.liquidationInput}
          value={poolAddress}
          onChange={e => setPoolAddress(e.target.value)}
          placeholder="Addresses of AMM pools"
        />
        <HoneyButton
          onClick={handleClick}
          className={c(styles.liquidationButton, {
            [styles.show]: poolAddress
          })}
          variant="text"
        >
          Add
        </HoneyButton>
      </div>

      {Boolean(pools.length) && (
        <div className={styles.liquidationList}>
          {pools.map(pool => (
            <div className={styles.liquidationItem} key={pool.id}>
              <Text className={styles.liquidationItemText}>{pool.value}</Text>
              <HoneyButton
                variant="text"
                onClick={() =>
                  setPools(prev => prev.filter(x => x.id !== pool.id))
                }
              >
                <div className={styles.liquidationDelete} />
              </HoneyButton>
            </div>
          ))}
        </div>
      )}

      <HoneyWarning message="Description about Liquidation markets.">
        <HoneyLink link="#" target="_blank">
          Learn More
        </HoneyLink>
      </HoneyWarning>
    </>
  );
};

export default LiquidationMarketsStep;
