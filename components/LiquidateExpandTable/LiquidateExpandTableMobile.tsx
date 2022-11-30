import HoneyTable from '../HoneyTable/HoneyTable';
import * as sharedStyles from '../../styles/markets.css';
import * as styles from './LiquidateExpandTable.css';
import React, { FC } from 'react';
import { ColumnType } from 'antd/lib/table';
import { LiquidateTablePosition } from '../../types/liquidate';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { formatNumber } from '../../helpers/format';
import HealthLvl from 'components/HealthLvl/HealthLvl';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import { renderMarketImageByID } from 'helpers/marketHelpers';

const { formatPercent: fp, formatSol: fs } = formatNumber;

export const LiquidateExpandTableMobile: FC<{
  data: LiquidateTablePosition[];
  onPlaceBid: Function;
  currentMarketId: string;
}> = ({ data, onPlaceBid, currentMarketId }) => {
  const expandColumnsMobile: ColumnType<LiquidateTablePosition>[] = [
    {
      dataIndex: 'name',
      sortOrder: 'descend',
      sorter: (a, b) => b.healthLvl - a.healthLvl,
      render: (name, record) => (
        <div className={sharedStyles.expandedRowNameCell}>
          <div className={sharedStyles.expandedRowIcon} />
          <div className={sharedStyles.collectionLogo}>
            <HexaBoxContainer>
              {renderMarketImageByID(currentMarketId)}
            </HexaBoxContainer>
          </div>
          <div className={sharedStyles.nameCellText}>
            <div className={sharedStyles.collectionNameMobile}>{name}</div>
            <HealthLvl healthLvl={record.healthLvl} />
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
          <span className={styles.positionsCount}>
            {data && data.length ? data.length : 0}
          </span>
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
