import { FC, useState } from 'react';
import * as styles from './CreateMarketTab.css';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import SidebarScroll from '../../SidebarScroll/SidebarScroll';
import { AddOracleStep } from '../AddOracleStep/AddOracleStep';
import { HoneySteps } from '../../HoneySteps/HoneySteps';
import { MarketStepsProps } from '../../HoneySteps/type';
import TabTitle from '../../HoneyTabs/TabTitle/TabTitle';
import { AboutMarketStep } from '../AboutMarketStep/AboutMarketStep';
import { SettingMarketStep } from '../SettingMarketStep/SettingMarketStep';
import { RiskModelStep } from '../RiskModelStep/RiskModelStep';
import { Keypair, PublicKey } from '@solana/web3.js';
import { HoneyMarket } from '@honey-finance/sdk';
import { buildReserveConfig } from './reserveConfigs';
import MarketDetailsStep from '../MarketDetailsStep/MarketDetailsStep';
import { HONEY_PROGRAM_ID } from 'constants/loan';
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';
import { extLink } from 'styles/common.css';

interface CreateMarketTabProps {
  wallet: any;
  honeyClient: any;
}
const CreateMarketTab: FC<CreateMarketTabProps> = (
  props: CreateMarketTabProps
) => {
  const { wallet, honeyClient } = props;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [createdMarket, setCreatedMarket] = useState<HoneyMarket | null>();
  const [collectionName, setCollectionName] = useState<string>('');
  const [collectionUrl, setCollectionUrl] = useState<string>('');
  const [nftCollectionCreator, setNftCollectionCreator] = useState();
  const [nftOracle, setNftOracle] = useState<PublicKey>();
  const [marketConfigOpts, setMarketConfigOpts] = useState<any>({});
  const [riskModel, setRiskModel] = useState<PublicKey>();

  const createMarket = async () => {
    const owner = wallet?.publicKey!;
    const quoteCurrencyName = 'USDC';
    const quoteCurrencyMint = new PublicKey(
      '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
    );

    // const marketKp: Keypair = Keypair.generate();
    // const marketPk = marketKp.publicKey;

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
    setCreatedMarket(await HoneyMarket.load(honeyClient, market.address));
    console.log('Market Public Key: ', market.address.toString());
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
    const reserveConfig = buildReserveConfig(riskModel, marketConfigOpts);
    createdMarket?.createReserve({
      switchboardOracle,
      tokenMint,
      config: reserveConfig
    });
  };

  const copyToClipboard = () => {
    const data = `COLLECTION_NAME=${collectionName}\nCOLLECTION_URL=${collectionUrl}\nVERIFIED_CREATOR=${nftCollectionCreator}\nNFT_ORACLE=${nftOracle}\nMARKET_ID=${createdMarket?.address.toString()}`;
    navigator.clipboard.writeText(data);
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
        <AboutMarketStep
          setNftCollectionCreator={setNftCollectionCreator}
          setCollectionName={setCollectionName}
          setCollectionUrl={setCollectionUrl}
        />
      )
    },
    {
      step: 2,
      content: <AddOracleStep setOracle={setNftOracle} />
    },
    {
      step: 3,
      content: <SettingMarketStep setMarketConfigOpts={setMarketConfigOpts} />
    },
    {
      step: 4,
      content: <RiskModelStep setRiskModel={setRiskModel} />
    },
    {
      step: 5,
      content: (
        <MarketDetailsStep
          createMarket={createMarket}
          createdMarket={createdMarket}
          initMarketReserve={initMarketReserve}
          copyToClipboard={copyToClipboard}
        ></MarketDetailsStep>
      )
    }
  ];

  const getTabTitle = () => {
    switch (currentStep + 1) {
      case 1:
        return {
          title: 'Create market'
        };
      case 2:
        return {
          title: 'Setup oracle',
          tooltip: (
            <HoneyTooltip
              tooltipIcon
              placement="top"
              label={
                <span>
                  An oracle is needed to track the floor price of your market’s
                  collateral.{' '}
                  <a
                    className={extLink}
                    target="_blank"
                    href="https://docs.switchboard.xyz/about"
                    rel="noreferrer"
                  >
                    {' '}
                    Learn more
                  </a>
                </span>
              }
            />
          )
        };
      case 3:
        return { title: 'Setup market parameters' };
      case 4:
        return { title: 'Select risk model' };
      case 5:
        return { title: 'Deploy programs' };
      default:
        return { title: '' };
    }
  };

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
          </div>
        </div>
      }
    >
      <div className={styles.createMarketTab}>
        <TabTitle {...getTabTitle()} className={styles.createMarket} />

        <HoneySteps
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <div className={styles.createSteps}>{steps[currentStep].content}</div>
      </div>
    </SidebarScroll>
  );
};

export default CreateMarketTab;
