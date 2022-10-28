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
import { HONEY_GENESIS_MARKET_ID, PESKY_PENGUINS_MARKET_ID } from 'constants/loan';

const { formatPercent: fp, formatSol: fs } = formatNumber;

type FilterType = 'most_critical' | 'max_debt' | 'most_valuable';

export const LiquidateExpandTable: FC<{ data: LiquidateTablePosition[], currentMarketId: string }> = ({
  data, currentMarketId
}) => {
  const [filter, setFilter] = useState<FilterType>('most_critical');

  const renderImage = (id: string) => {
    if (id == HONEY_GENESIS_MARKET_ID) {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6b6c8954aed777a74de52fd70f8751ab/46b325db'} layout="fill" />
    } else if (id == PESKY_PENGUINS_MARKET_ID) {
      return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://i.imgur.com/37nsjBZ.png'} layout="fill" />
    } 
    // else if (id == OG_ATADIANS) {
    //   return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/atadians_pfp_1646721263627.gif'} layout="fill" />
    // } else {
    //   return <Image src={'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/6972d5c2efb77d49be97b07ccf4fbc69/e9572fb8'} layout="fill" />
    // }
  }


  const expandColumns: ColumnType<LiquidateTablePosition>[] = useMemo(
    () => [
      {
        width: 250,
        dataIndex: 'name',
        sortOrder: filter === 'most_critical' ? 'descend' : undefined,
        sorter: (a, b) => b.healthLvl - a.healthLvl,
        render: (name, record) => (
          <div className={sharedStyles.expandedRowNameCell}>
            <div className={sharedStyles.expandedRowIcon} />
            <div className={sharedStyles.collectionLogo}>
              <HexaBoxContainer>
                {renderImage(currentMarketId)}
              </HexaBoxContainer>
            </div>
            <div className={sharedStyles.nameCellText}>
              <HoneyTooltip label={name}>
                <div className={sharedStyles.collectionName}>
                  {formatNFTName(name)}
                </div>
              </HoneyTooltip>
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
