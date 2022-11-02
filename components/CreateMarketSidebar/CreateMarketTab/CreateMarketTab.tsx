import { FC, useState } from 'react';
import * as styles from './CreateMarketTab.css';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import LiquidationMarketsStep from '../../LiquidationMarketsStep/LiquidationMarketsStep';
import { AddOracleStep } from '../AddOracleStep/AddOracleStep';
import { HoneySteps } from '../../HoneySteps/HoneySteps';
import { MarketStepsProps } from '../../HoneySteps/type';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';
import { AboutMarketStep } from '../AboutMarketStep/AboutMarketStep';
import { SettingMarketStep } from '../SettingMarketStep/SettingMarketStep';
import { RiskModelStep } from '../RiskModelStep/RiskModelStep';
import { PublicKey } from '@solana/web3.js';
import { HoneyMarket } from '@honey-finance/sdk';
import { buildReserveConfig } from './ReserveConfigs';

const CreateMarketTab: FC = (wallet: any, honeyClient: any) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [createdMarket, setCreatedMarket] = useState<HoneyMarket | null>();
  const [nftCollectionCreator, setNftCollectionCreator] = useState();
  const [nftOracle, setNftOracle] = useState<PublicKey>();
  const [marketConfigOpts, setMarketConfigOpts] = useState<any>({});
  const [riskModel, setRiskModel] = useState<PublicKey>();

  const logCurrent = () => {
    console.log('currentStep', currentStep);
    console.log('marketConfigOpts', marketConfigOpts);
    console.log('nftCollectionCreator', nftCollectionCreator);
    console.log('nftOracle', nftOracle);
    console.log('riskModel', riskModel);
  };

  const createMarket = async () => {
    const owner = wallet?.publicKey!;
    const quoteCurrencyName = 'USDC';
    const quoteCurrencyMint = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );
    // might want to consider adding some kinda validation here that
    // the verified creator actually points to the same nft
    const market = await honeyClient.createMarket({
      owner,
      quoteCurrencyName,
      quoteCurrencyMint,
      nftCollectionCreator,
      nftOraclePrice: nftOracle
    });
    // we need to tell the user somehow what their market id is, because if something gets messed up
    // between this step and another they will need to know what market id to use to fix it
    // + we might need to find a way to associate markets with PKs
    // or at least cache market ids in local storage
    setCreatedMarket(market);
    console.log(market.address.toBase58());

    // initialize the reserve
    await initMarketReserve();
  };

  const initMarketReserve = async () => {
    // default SOL + SOL/USDC switchboard
    // like above we don't do any validation here,
    // we just assume that the user knows what they are doing
    const switchboardOracle = new PublicKey(
      'GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR'
    );
    const tokenMint = new PublicKey(
      'So11111111111111111111111111111111111111112'
    );

    // we need to figure out how the user's changes in the creation page affect this
    const reserveConfig = buildReserveConfig();
    createdMarket?.createReserve({
      switchboardOracle,
      tokenMint,
      config: reserveConfig
    });
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps: MarketStepsProps[] = [
    {
      step: 1,
      content: (
        <AboutMarketStep setNftCollectionCreator={setNftCollectionCreator} />
      )
    },
    {
      step: 2,
      content: <LiquidationMarketsStep />
    },
    {
      step: 3,
      content: <AddOracleStep setOracle={setNftOracle} />
    },
    {
      step: 4,
      content: <SettingMarketStep setMarketConfigOpts={setMarketConfigOpts} />
    },
    {
      step: 5,
      content: <RiskModelStep setRiskModel={setRiskModel} />
    }
  ];

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton
              variant="secondary"
              disabled={currentStep === 0}
              onClick={() => prev()}
            >
              Back
            </HoneyButton>
          </div>
          <div className={styles.bigCol}>
            {currentStep < steps.length - 1 && (
              <HoneyButton variant="primary" block onClick={() => next()}>
                Next step
              </HoneyButton>
            )}
            {currentStep === steps.length - 1 && (
              <HoneyButton variant="primary" block onClick={() => logCurrent()}>
                Create market
              </HoneyButton>
            )}
          </div>
        </div>
      }
    >
      <div className={styles.createMarketTab}>
        <TabTitle title="Create market" className={styles.createMarket} />

        <HoneySteps steps={steps} currentStep={currentStep} />

        <div className={styles.createSteps}>{steps[currentStep].content}</div>
      </div>
    </SidebarScroll>
  );
};

export default CreateMarketTab;
