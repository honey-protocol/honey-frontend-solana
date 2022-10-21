import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import HoneyTable from '../HoneyTable/HoneyTable';
import * as sharedStyles from '../../styles/markets.css';
import * as styles from './LiquidateExpandTable.css';
import React, { FC, useMemo, useState } from 'react';
import { ColumnType } from 'antd/lib/table';
import { LiquidateTablePosition } from '../../types/liquidate';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyGenesisBee from '/public/images/imagePlaceholder.png';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { formatNumber, formatNFTName } from '../../helpers/format';
import RiskLvl from '../RiskLvl/RiskLvl';
import HoneyTooltip from '../HoneyTooltip/HoneyTooltip';
import HealthLvl from 'components/HealthLvl/HealthLvl';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { MAX_LTV } from 'constants/loan';

const { formatPercent: fp, formatSol: fs } = formatNumber;

export const LiquidateExpandTableMobile: FC<{
  data: LiquidateTablePosition[];
  onPlaceBid: Function;
}> = ({ data, onPlaceBid }) => {
  const expandColumnsMobile: ColumnType<LiquidateTablePosition>[] = [
    {
      dataIndex: 'name',
      render: (name, record) => (
        <div className={sharedStyles.expandedRowNameCell}>
          <div className={sharedStyles.expandedRowIcon} />
          <div className={sharedStyles.collectionLogo}>
            <HexaBoxContainer>
              <Image src={honeyGenesisBee} />
            </HexaBoxContainer>
          </div>
          <div className={sharedStyles.nameCellText}>
            <div className={sharedStyles.collectionNameMobile}>{name}</div>
            <RiskLvl riskLvl={record.riskLvl} />
          </div>
        </div>
      )
    },
    {
      dataIndex: 'untilLiquidation',
      render: untilLiquidation => (
        <div className={sharedStyles.expandedRowCell}>
          <InfoBlock
            title={'Until liquidation:'}
            value={fs(untilLiquidation)}
          />
        </div>
      )
    }
  ];
  return (
    <>
      <div className={styles.expandTableHeader}>
        <div className={styles.positionsCounterContainer}>
          <span className={styles.positionsCounterTitleMobile}>
            Open positions
          </span>
          <span className={styles.positionsCount}>{data.length}</span>
        </div>
        <HoneyButton variant="text" onClick={() => onPlaceBid()}>
          Place bid <div className={sharedStyles.arrowRightIcon} />
        </HoneyButton>
      </div>
      <HoneyTable
        className={sharedStyles.expandContentTable}
        columns={expandColumnsMobile}
        dataSource={data}
        pagination={false}
        showHeader={false}
      />
    </>
  );
};

export default LiquidateExpandTableMobile;
