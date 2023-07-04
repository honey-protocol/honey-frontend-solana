import React, { FC, ReactNode } from 'react';
import Head from 'next/head';
import Layout, {
  Content,
  Header as LayoutHeader
} from 'antd/lib/layout/layout';
import Header from '../../components/Header/Header';
import * as styles from './LayoutRedesign.css';

interface Props {
  children: ReactNode;
}
const alertMsg = 'This product is in beta ! Please use at your own risk';
const LayoutRedesign: FC<Props> = ({ children }) => {
  // const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  // const imageUrl = `${window.location.origin}/api/og?id=${id}`;
  const imageUrl = `${window.location.origin}/api/og?id=A7QtyzBeCjZHAD9X4Yfkqh2terwZaQj5erPZWEJKWwzo`;
  return (
    <Layout className={styles.layout}>
      <Head>
        <title>Honey Finance</title>
        {/* <meta name="description" content="Liquidity solution for NFTs" /> */}
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <LayoutHeader className={styles.layoutHeader}>
        <Header />
      </LayoutHeader>
      {/* {alertMsg && (
        <div className={styles.alertBox}>
          <div className={styles.alertContent}>
            This product is in beta ! Please use at your own risk
          </div>
        </div>
      )} */}
      <Layout className={styles.contentContainer}>
        <div className={styles.contentCenter}>
          {/* Provide a <Content> and <Sider> in child component */}
          <img src={imageUrl} />
          {children}
        </div>
      </Layout>
      {/*<Footer> We do not need footer right but just in case</Footer>*/}
    </Layout>
  );
};

export default LayoutRedesign;
