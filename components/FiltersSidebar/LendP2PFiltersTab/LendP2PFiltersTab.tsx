import * as styles from './LendP2PFiltersTab.css';
import { HoneySelect } from '../../HoneySelect/HoneySelect';
import { HoneyTags } from '../../HoneyTags/HoneyTags';
import { LendP2PSlider } from '../LendP2PSlider/LendP2PSlider';
import { useCallback, useState } from 'react';
import { LendP2PSidebarFooter } from '../LendP2PSidebarFooter/LendP2PSidebarFooter';
import { DefaultOptionType } from 'rc-select/es/Select';
import SectionTitle from '../../SectionTitle/SectionTitle';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import { LendP2PFiltersTabProps } from '../types';
import HoneyButton from '../../HoneyButton/HoneyButton';
import { formatNumber } from '../../../helpers/format';

const { formatPercentRounded: fpr, formatSol: fs } = formatNumber;

export const LendP2PFiltersTab = ({
  totalRequestedRange,
  totalSuppliedRange,
  interestRange,
  onChangeTotalSuppliedRange,
  onChangeInterestRange,
  onChangeTotalRequestedRange,
  tags,
  rules,
  maxTotalRequest,
  minTotalRequest,
  maxInterest,
  minInterest,
  maxTotalSupplied,
  minTotalSupplied,
  selectedTags,
  onChangeSelectedTags
}: LendP2PFiltersTabProps) => {
  const [availableRules, setAvailableRules] =
    useState<DefaultOptionType[]>(rules);
  const [selects, setSelects] = useState([availableRules[0]?.value]);
  const [counter, setCounter] = useState<number>(10);

  const handleAddRule = () => {
    if (availableRules.length < 1) {
      return;
    }
    if (availableRules.length > 1) {
      setSelects([...selects, availableRules[0].value]);
    }
  };

  const handleSelect = (value: string) => {
    if (!selects.includes(value)) {
      setAvailableRules([
        ...rules.filter(
          item => item.value !== value && !selects.includes(item.value)
        )
      ]);
    }
  };

  const filtersSelects = useCallback(() => {
    return selects.map(item => {
      return (
        <HoneySelect
          options={availableRules.filter(item => !selects.includes(item.value))}
          defaultValue={availableRules[0]}
          onSelect={handleSelect}
          key={item}
        />
      );
    });
  }, [selects]);

  const handleTagSelect = (tag: string) => {
    if (selectedTags?.includes(tag)) {
      onChangeSelectedTags(
        selectedTags?.filter((item: string) => item !== tag)
      );
    }
    selectedTags && onChangeSelectedTags([...selectedTags, tag]);
  };

  return (
    <SidebarScroll
      footer={
        <LendP2PSidebarFooter
          firstButtonTitle={'CANCEL'}
          secondButtonTitle={'LEND'}
          isDisableSecondButton={false}
          onClose={() => {}}
          counter={counter}
        />
      }
    >
      <div className={styles.lendP2PFiltersTab}>
        <SectionTitle className={styles.sidebarTitle} title={'Sort By'} />
        <div className={styles.ruleWrapper}>{filtersSelects()}</div>
        <div className={styles.addRuleWrapper}>
          <HoneyButton variant="text" onClick={handleAddRule}>
            <div className={styles.addRuleIcon} />
            ADD RULE
          </HoneyButton>
        </div>
        <SectionTitle className={styles.tagsTitle} title={'Tags'} />
        <div className={styles.tagsWrapper}>
          {tags.map(tag => (
            <HoneyTags title={tag} key={tag} onSelectTag={handleTagSelect} />
          ))}
        </div>
        <SectionTitle
          className={styles.sliderTitle}
          title={' Average Interest Ratio (%)'}
        />
        <div className={styles.sliderWrapper}>
          <LendP2PSlider
            currentValue={interestRange}
            maxValue={maxInterest}
            onChange={onChangeInterestRange}
            minValue={minInterest}
            labelsFormatter={fpr}
          />
        </div>
        <SectionTitle
          className={styles.sliderTitle}
          title={'Total Requested'}
        />
        <div className={styles.sliderWrapper}>
          <LendP2PSlider
            currentValue={totalRequestedRange}
            maxValue={maxTotalRequest}
            onChange={onChangeTotalRequestedRange}
            minValue={minTotalRequest}
            labelsFormatter={fs}
          />
        </div>
        <SectionTitle className={styles.sliderTitle} title={'Total Supplied'} />
        <div className={styles.sliderWrapper}>
          <LendP2PSlider
            currentValue={totalSuppliedRange}
            maxValue={maxTotalSupplied}
            onChange={onChangeTotalSuppliedRange}
            minValue={minTotalSupplied}
            labelsFormatter={fs}
          />
        </div>
      </div>
    </SidebarScroll>
  );
};
