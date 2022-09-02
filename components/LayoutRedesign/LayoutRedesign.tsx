import React, { FC, ReactNode } from 'react';
import Head from 'next/head';
import Layout, { Header as LayoutHeader } from 'antd/lib/layout/layout';
import Header from '../../components/Header/Header';
import * as styles from './LayoutRedesign.css';

interface Props {
  children: ReactNode;
  sidebar?: ReactNode;
}

const LayoutRedesign: FC<Props> = ({ children, sidebar }) => {
  // const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  return (
    <Layout className={styles.layout}>
      <Head>
        <title>Honey Finance</title>
        {/* <meta name="description" content="Liquidity solution for NFTs" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutHeader>
        <Header />
      </LayoutHeader>
      <Layout>
        {/* Provide a <Content> and <Sider> in child component */}
        {children}
      </Layout>
      {/*<Footer> We do not need footer right but just in case</Footer>*/}
    </Layout>
  );
};

export default LayoutRedesign;
