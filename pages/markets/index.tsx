import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import MarketsSidebar from '../../components/MarketsSidebar/MarketsSidebar';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';

const Markets: NextPage = () => {
  return (
    <LayoutRedesign>
      <Content>Content is here</Content>
      <Sider>
        <MarketsSidebar />
      </Sider>
    </LayoutRedesign>
  );
};

export default Markets;
