import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import { ColumnType } from 'antd/lib/table';
import * as style from '../../styles/markets.css';
import { MarketTableRow } from '../../types/markets';
import { useEffect, useState } from 'react';
import { formatNumber } from '../../helpers/format';

const { format: f, formatPercent: fp, formatUsd: fu } = formatNumber;
const columns: ColumnType<MarketTableRow>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (name: string) => {
      return (
        <div className={style.nameCell}>
          <div className={style.collectionLogo}>Logo</div>
          <div className={style.collectionName}>{name}</div>
        </div>
      );
    }
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    render: (rate: number) => {
      return <div className={style.rateCell}>{fp(rate * 100)}</div>;
    }
  },
  {
    title: 'Available',
    dataIndex: 'available',
    render: (available: number) => {
      return <div className={style.availableCell}>{fu(available)}</div>;
    }
  },
  {
    title: 'Value',
    dataIndex: 'value',
    render: (value: number) => {
      return <div className={style.valueCell}>{fu(value)}</div>;
    }
  },
  {
    title: '',
    dataIndex: '',
    render: () => {
      return (
        <div className={style.buttonsCell}>
          <button>View</button>
        </div>
      );
    }
  }
];

const Markets: NextPage = () => {
  const [tableData, setTableData] = useState<MarketTableRow[]>([]);

  useEffect(() => {
    const mockData: MarketTableRow[] = [
      {
        key: '0',
        name: 'Test',
        rate: 0.1,
        available: 100,
        value: 100000
      },
      {
        key: '1',
        name: 'Very long collection name very long',
        rate: 0.1,
        available: 100,
        value: 100000
      }
    ];

    setTableData(mockData);
  }, []);

  return (
    <LayoutRedesign>
      <Content>
        <HoneyTable columns={columns} dataSource={tableData} />
      </Content>
      <Sider>
        <MarketsSidebar />
      </Sider>
    </LayoutRedesign>
  );
};

export default Markets;
