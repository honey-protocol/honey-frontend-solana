import type { NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import LayoutRedesign from '../../../components/LayoutRedesign/LayoutRedesign';
import HoneyContent from '../../../components/HoneyContent/HoneyContent';
import HoneySider from '../../../components/HoneySider/HoneySider';
import LendingSidebar from '../../../components/LendingSidebar/LendingSidebar';
import { Typography } from 'antd';
import { pageDescription, pageTitle } from 'styles/common.css';
import { LendFormProps } from '../../../components/LendForm/types';
import { FiltersSidebar } from '../../../components/FiltersSidebar/FiltersSidebar';
import { CategoryCards } from '../../../components/CategoryCards/CategoryCards';
import { P2PPosition, P2PCollection, PageMode } from '../../../types/p2p';
import { P2PPageTitle } from '../../../components/P2PPagesTitle/P2PPageTitle';
import { CollectionsCards } from '../../../components/CollectionsCards/CollectionsCards';
import { P2PLendingMainList } from 'components/P2PLendingMainList/P2PLendingMainList';
import { DefaultOptionType } from 'rc-select/es/Select';
import { FeaturedCategory } from '../../../components/FeaturedCategories/types';
import { FeaturedCategories } from '../../../components/FeaturedCategories/FeaturedCategories';

const mockData: LendFormProps = {
  name: 'Doodle #1290',
  imageUrl: '/images/mock-collection-image@2x.png',
  collectionName: 'Doodles',
  request: 123,
  ir: 2,
  total: 300,
  duePeriod: 1667557681931,
  loanStart: 1667395278840,
  walletAddress: '2ijWvdsnOP1vnjds8ыvkd12',
  borrowerTelegram: '#',
  borrowerDiscord: '#'
};

const featuredCategoriesMock: FeaturedCategory[] = [
  {
    title: 'FLASHY',
    subtitle: 'NFT Finance collections',
    color: 'brownLight',
    icon: '/images/flashy-category-icon.svg'
  },
  {
    title: 'Blue Chips',
    subtitle: 'Degods, Monkey DAO, etc.',
    color: 'blue',
    icon: '/images/coin-category-icon.svg'
  },
  {
    title: 'Financial Products',
    subtitle: 'Options, LP Positions, etc.',
    color: 'green',
    icon: '/images/finance-category-icon.svg'
  }
];

const mockFilterParams = {
  maxTotalRequest: Math.floor(Math.random() * 1000),
  minTotalRequest: Math.floor(Math.random()),
  maxInterest: Math.floor(Math.random() * 10),
  minInterest: Math.floor(Math.random()),
  maxTotalSupplied: Math.floor(Math.random() * 1000),
  minTotalSupplied: Math.floor(Math.random())
};
const mockTags = [
  '#Art',
  '#Domains',
  '#Financial',
  '#Gaming',
  '#Music',
  '#PFP',
  '#Staking',
  '#Utility'
];
const rulesFilters: DefaultOptionType[] = [
  { label: 'Rule #1', value: 'rule_1', rule: 'mock rule#1' },
  { label: 'Rule #2', value: 'rule_2', rule: 'mock rule#2' },
  { label: 'Rule #3', value: 'rule_3', rule: 'mock rule#3' },
  { label: 'Rule #4', value: 'rule_4', rule: 'mock rule#4' },
  { label: 'Rule #5', value: 'rule_5', rule: 'mock rule#5' },
  { label: 'Rule #6', value: 'rule_6', rule: 'mock rule#6' }
];

function getCollectionsListMock() {
  const preparedPositions: P2PCollection[] = [];
  for (let i = 0; i < 20; i++) {
    preparedPositions.push({
      name: `User #${i + 1000}`,
      tag: `tag #${i + 1000}`,
      total: Math.random() * 1000,
      items: Math.random() * 1000,
      requested: Math.random(),
      imageUrl: '/images/mock-collection-image@2x.png',
      id: i.toString() + '_lend'
    });
  }
  return preparedPositions;
}

function getNftListMock() {
  const preparedPositions: P2PPosition[] = [];
  for (let i = 0; i < 20; i++) {
    preparedPositions.push({
      name: `User #${i + 1000}`,
      collectionName: `tag #${i + 1000}`,
      request: Math.random() * 1000,
      ir: Math.random() * 1000,
      total: Math.random(),
      imageUrl: '/images/mock-collection-image@2x.png',
      end: 1667557681931,
      start: 1667395278840,
      walletAddress: '2ijWvdsnOP1vnjds8ыvkd12',
      borrowerTelegram: '#',
      borrowerDiscord: '#',
      address: i.toString() + '_lend'
    });
  }
  return preparedPositions;
}

const Lending: NextPage = () => {
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const [pageMode, setPageMode] = useState<PageMode>(PageMode.INITIAL_STATE);
  const [selectedCategory, setSelectedCategory] = useState<FeaturedCategory>();
  const [selected, setSelected] = useState<string | undefined>();

  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  const hideMobileSidebar = () => {
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };

  const handleSelectCategory = (title: string) => {
    const foundCategory = featuredCategoriesMock.find(
      item => item.title === title
    );
    if (foundCategory) {
      setPageMode(PageMode.CATEGORY_SELECTED);
      setSelectedCategory(foundCategory);
    }
  };

  const handleCollectionSelect = (id: string) => {
    setSelected(id);
    setPageMode(PageMode.COLLECTION_SELECTED);
  };

  const mockCollectionsList = useMemo(() => getCollectionsListMock(), []);
  const mockNftList = useMemo(() => getNftListMock(), []);

  const lendingSidebar = () => {
    switch (pageMode) {
      case PageMode.INITIAL_STATE:
        return (
          <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
            <FiltersSidebar
              tags={mockTags}
              rules={rulesFilters}
              initParams={mockFilterParams}
            />
          </HoneySider>
        );
      case PageMode.CATEGORY_SELECTED:
        return (
          <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
            <FiltersSidebar
              tags={mockTags}
              rules={rulesFilters}
              initParams={mockFilterParams}
            />
          </HoneySider>
        );
      default:
        return (
          <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
            <LendingSidebar
              name={mockData.name}
              imageUrl={mockData.imageUrl}
              collectionName={mockData.collectionName}
              request={mockData.request}
              ir={mockData.ir}
              total={mockData.total}
              duePeriod={mockData.duePeriod}
              loanStart={mockData.loanStart}
              walletAddress={mockData.walletAddress}
              borrowerTelegram={mockData.borrowerTelegram}
              borrowerDiscord={mockData.borrowerDiscord}
              collectionId={'s'}
              onCancel={hideMobileSidebar}
            />
          </HoneySider>
        );
    }
  };

  const cards = (pageMode: PageMode) => {
    switch (pageMode) {
      case PageMode.INITIAL_STATE:
        return (
          <CategoryCards
            onSelect={handleCollectionSelect}
            selected={selected}
            data={mockCollectionsList}
          />
        );
      case PageMode.CATEGORY_SELECTED:
        return (
          <CollectionsCards
            onSelect={handleCollectionSelect}
            selected={selected}
            data={mockCollectionsList}
          />
        );
      case PageMode.COLLECTION_SELECTED:
        return <P2PLendingMainList data={mockNftList} />;
    }
  };

  const title = (pageMode: PageMode) => {
    switch (pageMode) {
      case PageMode.INITIAL_STATE:
        return (
          <>
            <Typography.Title className={pageTitle}>
              P2P Lending
            </Typography.Title>
            <Typography.Text className={pageDescription}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has
            </Typography.Text>
            <FeaturedCategories
              data={featuredCategoriesMock}
              onClick={handleSelectCategory}
            />
          </>
        );
      case PageMode.CATEGORY_SELECTED:
        return (
          <P2PPageTitle
            onGetBack={() => setPageMode(PageMode.INITIAL_STATE)}
            name={mockData.name}
            img={mockData.imageUrl}
          />
        );
      case PageMode.COLLECTION_SELECTED:
        return (
          <P2PPageTitle
            onGetBack={() => setPageMode(PageMode.CATEGORY_SELECTED)}
            name={mockData.name}
            img={mockData.imageUrl}
          />
        );
    }
  };

  return (
    <LayoutRedesign>
      <HoneyContent>{title(pageMode)}</HoneyContent>
      <HoneyContent sidebar={lendingSidebar()}>{cards(pageMode)}</HoneyContent>
    </LayoutRedesign>
  );
};

export default Lending;
