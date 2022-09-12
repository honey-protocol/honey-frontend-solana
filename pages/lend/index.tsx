import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import LendSidebar from '../../components/LendSidebar/LendSidebar';

const Lend: NextPage = () => {
  return (
    <LayoutRedesign>
      <Content>Content</Content>
      <Sider width={350}>
        <LendSidebar collectionId="s" />
      </Sider>
    </LayoutRedesign>
  );
};

export default Lend;
