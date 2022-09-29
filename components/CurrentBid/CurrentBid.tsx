import React from 'react';
import HoneyButton from '../HoneyButton/HoneyButton';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import * as styles from './CurrentBid.css';
import { formatNumber } from '../../helpers/format';

interface CurrentBidProps {
  title?: string;
  value: number;
  handleRevokeBid: (type: string) => void;
  handleIncreaseBid: (type: string, userBid: number) => void;
}

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;

const CurrentBid = (props: CurrentBidProps) => {
  const {handleRevokeBid, handleIncreaseBid} = props;
  return (
    <div className={styles.CurrentBidContainer}>
      <InfoBlock value={fu(props.value)} valueSize="big" title={props.title} />

      <HoneyButton onClick={() => handleRevokeBid('revoke_bid')} variant='secondary'>Cancel</HoneyButton>
    </div>
  );
};

export default CurrentBid;