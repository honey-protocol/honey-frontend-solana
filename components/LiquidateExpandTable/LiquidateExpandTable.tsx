import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import HoneyTable from '../HoneyTable/HoneyTable';
import * as sharedStyles from '../../styles/markets.css';
import * as styles from './LiquidateExpandTable.css';
import React, { FC, useMemo, useState } from 'react';
import { ColumnType } from 'antd/lib/table';
import { LiquidateTablePosition } from '../../types/liquidate';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { formatNumber, formatNFTName } from '../../helpers/format';
import RiskLvl from '../RiskLvl/RiskLvl';
import HoneyTooltip from '../HoneyTooltip/HoneyTooltip';
import HealthLvl from 'components/HealthLvl/HealthLvl';
import { renderMarketImageByID } from 'helpers/marketHelpers';
import { RoundHalfDown } from 'helpers/utils';
import { LiquidateExpandTableProps } from './LiquidateExpandTableProps';
import c from 'classnames';

const { formatPercent: fp, formatSol: fs } = formatNumber;

type FilterType = 'most_critical' | 'max_debt' | 'most_valuable';

export const LiquidateExpandTable = (props: LiquidateExpandTableProps) => {
  const { data, currentMarketId } = props;

  const [filter, setFilter] = useState<FilterType>('most_critical');

  const expandColumns: ColumnType<LiquidateTablePosition>[] = useMemo(
    () => [
      {
        width: 250,
        dataIndex: 'name',
        sortOrder: filter === 'most_critical' ? 'descend' : undefined,
        sorter: (a, b) => b.healthLvl - a.healthLvl,
        render: (name, record) => {
          return (
            <div className={sharedStyles.expandedRowNameCell}>
              <div className={sharedStyles.expandedRowIcon} />
              {record.count > 1 ? (
                <div className={styles.logoWrapper}>
                  <div className={styles.collectionLogo}>
                    <HexaBoxContainer>
                      {renderMarketImageByID(currentMarketId)}
                    </HexaBoxContainer>
                  </div>
                  <div
                    className={c(styles.collectionLogo, styles.secondaryLogo)}
                  >
                    <HexaBoxContainer>
                      {renderMarketImageByID(currentMarketId)}
                    </HexaBoxContainer>
                  </div>
                </div>
              ) : (
                <div className={sharedStyles.collectionLogo}>
                  <HexaBoxContainer>
                    {renderMarketImageByID(currentMarketId)}
                  </HexaBoxContainer>
                </div>
              )}

              <div className={sharedStyles.nameCellText}>
                <HoneyTooltip title={name}>
                  <div className={sharedStyles.collectionName}>
                    {formatNFTName(name)}
                  </div>
                </HoneyTooltip>
                <HealthLvl healthLvl={record.healthLvl} />
              </div>
            </div>
          );
        }
      },
      {
        dataIndex: 'debt',
        sortOrder: filter === 'max_debt' ? 'descend' : undefined,
        sorter: (a, b) => a.debt - b.debt,
        render: debt => (
          <div className={sharedStyles.expandedRowCell}>
            <InfoBlock title={'Debt:'} value={fs(debt)} />
          </div>
        )
      },
      {
        dataIndex: 'untilLiquidation',
        render: (untilLiquidation, record) => {
          return (
            <div className={sharedStyles.expandedRowCell}>
              <InfoBlock
                title={'Liquidation Price:'}
                value={fs(
                  RoundHalfDown(record.estimatedValue - untilLiquidation, 5)
                )}
              />
            </div>
          );
        }
      },
      {
        dataIndex: 'estimatedValue',
        sortOrder: filter === 'most_valuable' ? 'descend' : undefined,
        sorter: (a, b) => a.estimatedValue - b.estimatedValue,
        render: estimatedValue => (
          <div className={sharedStyles.expandedRowCell}>
            <InfoBlock title={'Collateral value:'} value={fs(estimatedValue)} />
          </div>
        )
      }
    ],
    [filter]
  );

  return (
    <>
      <div className={styles.expandTableHeader}>
        <div className={styles.positionsCounterContainer}>
          <span className={styles.positionsCounterTitle}>Open positions</span>
          <span className={styles.positionsCount}>
            {data && data.length ? data.length : 0}
          </span>
        </div>
        <HoneyButtonTabs
          items={[
            { name: 'most critical', slug: 'most_critical' },
            { name: 'Maximum debt', slug: 'max_debt' },
            { name: 'most valuable', slug: 'most_valuable' }
          ]}
          activeItemSlug={filter}
          onClick={itemSlug => setFilter(itemSlug as FilterType)}
        />
      </div>
      <HoneyTable
        tableLayout="fixed"
        className={sharedStyles.expandContentTable}
        columns={expandColumns}
        dataSource={data}
        pagination={false}
        showHeader={false}
      />
    </>
  );
};
