import * as styles from './SettingMarketStep.css';
import HoneyTooltip from '../../HoneyTooltip/HoneyTooltip';
import React, { useEffect, useState } from 'react';
import HoneyFormattedNumericInput from '../../HoneyFormattedNumericInput/HoneyFormattedInput';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import { CreateMarketSlider } from '../CreateMarketSlider/CreateMarketSlider';
import { formatNumber } from '../../../helpers/format';
import { isNil } from '../../../helpers/utils';
import { vars } from '../../../styles/theme.css';
import c from 'classnames';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';

const MIN_LUQUIDATION_VALUE = 15;

interface SettingMarketStepProps {
  setMarketConfigOpts: any;
}

export const SettingMarketStep = (props: SettingMarketStepProps) => {
  const { setMarketConfigOpts } = props;
  const [liquidationFee, setLiquidationFee] = useState<ValueType | undefined>();
  const [adminFee, setAdminFee] = useState<ValueType | undefined>();
  const [maxLTV, setMaxLTV] = useState<number>(0);
  const [liquidationThreshold, setLiquidationThreshold] = useState<number>(
    MIN_LUQUIDATION_VALUE
  );
  const maxLiquidationFee = 100;
  const maxAdminFee = 50;

  useEffect(() => {
    setMarketConfigOpts({
      liquidationFee: liquidationFee,
      adminFee: adminFee,
      maxLTV: maxLTV,
      liquidationThreshold: liquidationThreshold
    });
  }, [liquidationFee, adminFee, maxLTV, liquidationThreshold]);

  const handleLiquidationFeeChange = (value: ValueType) => {
    if (isNil(value)) {
      setLiquidationFee(undefined);
    } else {
      if (Number(value) >= 100) {
        setLiquidationFee(Number(100));
      } else {
        setLiquidationFee(Number(value));
      }
    }
  };

  const handleAdminFeeChange = (value: ValueType) => {
    if (isNil(value)) {
      setAdminFee(undefined);
    } else {
      if (Number(value) >= 50) {
        setAdminFee(Number(50));
      } else {
        setAdminFee(Number(value));
      }
    }
  };

  const defaultInputFormatted = (value: ValueType | undefined) => {
    // TODO: pass decimals as props if needed
    return value ? formatNumber.formatPercentRounded(Number(value), 2) : '';
  };

  const liquidationFeeInputButtonsRender = () => {
    return (
      <div className={styles.inputButtons}>
        <div
          role={'button'}
          onClick={() => setLiquidationFee(Number(liquidationFee) + 1)}
          className={styles.incrementValueButton}
        >
          {' '}
        </div>
        <div
          role={'button'}
          onClick={() => setLiquidationFee(Number(adminFee) - 1)}
          className={styles.decrementValueButton}
        >
          {' '}
        </div>
      </div>
    );
  };

  const adminFeeInputButtonsRender = () => {
    return (
      <div className={styles.inputButtons}>
        <div
          role={'button'}
          onClick={() => setAdminFee(Number(liquidationFee) + 1)}
          className={styles.incrementValueButton}
        >
          {' '}
        </div>
        <div
          role={'button'}
          onClick={() => setAdminFee(Number(adminFee) - 1)}
          className={styles.decrementValueButton}
        >
          {' '}
        </div>
      </div>
    );
  };

  const isLiquidationFeeRisky = Number(liquidationFee) >= maxLiquidationFee;

  const isAdminFeeRisky = Number(adminFee) >= maxAdminFee;

  return (
    <div className={styles.settingMarketStep}>
      <div className={styles.liquidationFee}>
        <div className={styles.liquidationFeeTitle}>
          <TabTitle
            title="Liquidation Fee"
            tooltip={
              <HoneyTooltip tooltipIcon placement="top" label={'Mock'} />
            }
          />
        </div>
        <div
          className={c(styles.inputWrapper, {
            [styles.inputBordersRed]:
              maxLiquidationFee <= Number(liquidationFee)
          })}
        >
          <HoneyFormattedNumericInput
            className={styles.input}
            placeholder="0.00"
            value={liquidationFee}
            decimalSeparator="."
            onChange={handleLiquidationFeeChange}
            formatter={defaultInputFormatted}
            bordered
            addonAfter={liquidationFeeInputButtonsRender()}
          />
        </div>
        <div
          className={styles.inputDescription}
          style={
            isLiquidationFeeRisky
              ? { color: vars.colors.red }
              : { color: vars.colors.black }
          }
        >
          Up to 100 %
        </div>
      </div>
      <div className={styles.adminFee}>
        <div className={styles.adminFeeTitle}>
          <TabTitle
            title="Admin Fee"
            tooltip={
              <HoneyTooltip tooltipIcon placement="top" label={'Mock'} />
            }
          />
        </div>
        <div
          className={c(styles.inputWrapper, {
            [styles.inputBordersRed]: maxAdminFee <= Number(adminFee)
          })}
        >
          <HoneyFormattedNumericInput
            className={styles.input}
            placeholder="0.00"
            value={adminFee}
            decimalSeparator="."
            onChange={handleAdminFeeChange}
            formatter={defaultInputFormatted}
            bordered
            addonAfter={adminFeeInputButtonsRender()}
          />
        </div>
        <div
          className={styles.inputDescription}
          style={
            isAdminFeeRisky
              ? { color: vars.colors.red }
              : { color: vars.colors.black }
          }
        >
          Up to 50 %
        </div>
      </div>
      <div className={styles.maximumLtv}>
        <div className={styles.maximumLtvTitle}>
          <TabTitle
            title="Maximum LTV"
            tooltip={
              <HoneyTooltip tooltipIcon placement="top" label={'Mock'} />
            }
          />
        </div>
        <CreateMarketSlider
          currentValue={maxLTV}
          onChange={setMaxLTV}
          minValue={10}
          maxValue={90}
        />
      </div>
      <div className={styles.liquidationThreshold}>
        <div className={styles.liquidationThresholdTitle}>
          <TabTitle
            title=" Liquidation threshold"
            tooltip={
              <HoneyTooltip tooltipIcon placement="top" label={'Mock'} />
            }
          />
        </div>
        <CreateMarketSlider
          currentValue={liquidationThreshold}
          onChange={setLiquidationThreshold}
          maxSafeValue={40}
          dangerValue={75}
          minValue={MIN_LUQUIDATION_VALUE}
          maxValue={95}
          // totalValue={95}
        />
      </div>
    </div>
  );
};
