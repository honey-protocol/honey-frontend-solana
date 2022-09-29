import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import HoneyTable from '../HoneyTable/HoneyTable';
import * as sharedStyles from '../../styles/markets.css';
import * as styles from './LiquidateExpandTable.css';
import React, { FC, useMemo, useState } from 'react';
import { ColumnType } from 'antd/lib/table';
import { LiquidateTablePosition } from '../../types/liquidate';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import Image from 'next/image';
import honeyEyes from '/public/nfts/honeyEyes.png';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { formatNumber } from '../../helpers/format';

const { formatPercent: fp, formatSol: fs } = formatNumber;

type FilterType = 'most_critical' | 'max_debt' | 'most_valuable';

export const LiquidateExpandTable: FC<{ data: LiquidateTablePosition[] }> = ({
  data
}) => {
  const [filter, setFilter] = useState<FilterType>('most_critical');

  const expandColumns: ColumnType<LiquidateTablePosition>[] = useMemo(
    () => [
      {
        width: 250,
        dataIndex: 'name',
        sortOrder: filter === 'most_critical' ? 'descend' : undefined,
        sorter: (a, b) => a.riskLvl - b.riskLvl,
        render: (name, record) => (
          <div className={sharedStyles.expandedRowNameCell}>
            <div className={sharedStyles.expandedRowIcon} />
            <div className={sharedStyles.collectionLogo}>
              <HexaBoxContainer>
                <Image src={honeyEyes} />
              </HexaBoxContainer>
            </div>
            <div className={sharedStyles.nameCellText}>
              <div className={sharedStyles.collectionName}>{name}</div>
              <div className={sharedStyles.risk.safe}>
                <span className={sharedStyles.valueCell}>
                  {fp(record.riskLvl)}
                </span>{' '}
                <span className={sharedStyles.riskText}>Risk lvl</span>
              </div>
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
        dataIndex: 'estimatedValue',
        sortOrder: filter === 'most_valuable' ? 'descend' : undefined,
        sorter: (a, b) => a.estimatedValue - b.estimatedValue,
        render: estimatedValue => (
          <div className={sharedStyles.expandedRowCell}>
            <InfoBlock title={'Estimated value:'} value={fs(estimatedValue)} />
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
          <span className={styles.positionsCount}>{data.length}</span>
        </div>
        <HoneyButtonTabs
          items={[
            { name: 'The most critical', slug: 'most_critical' },
            { name: 'Maximum debt', slug: 'max_debt' },
            { name: 'The most valuable', slug: 'most_valuable' }
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
