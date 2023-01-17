import { useEffect, useState } from 'react';
import Image from 'next/image';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { HoneySlider } from '../HoneySlider/HoneySlider';
import * as styles from './RepayForm.css';
import { formatNumber } from '../../helpers/format';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HexaBoxContainer from '../HexaBoxContainer/HexaBoxContainer';
import { RepayProps } from './types';
import SidebarScroll from '../SidebarScroll/SidebarScroll';
import { hAlign, extLink } from 'styles/common.css';
import { questionIcon } from 'styles/icons.css';
import cs from 'classnames';
import useToast from 'hooks/useToast';
import { useSolBalance } from 'hooks/useSolBalance';
import { MAX_LTV } from 'constants/loan';
import { COLLATERAL_FACTOR } from 'helpers/marketHelpers';
import { renderMarketImageByID } from 'helpers/marketHelpers';
import { Space } from 'antd';
import BonkIcon from 'images/bonkCoin.png';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { BONK_DECIMAL_DIVIDER_MIL } from 'constants/market';

const {
  format: f,
  formatPercent: fp,
  formatSol: fs,
  parse: p,
  formatRoundDown: frd,
  formatShortName: fsn
} = formatNumber;

const RepayForm = (props: RepayProps) => {
  // extract props
  const {
    executeRepay,
    openPositions,
    nftPrice,
    executeWithdrawNFT,
    userAllowance,
    userDebt,
    loanToValue,
    fetchedReservePrice,
    currentMarketId,
    hideMobileSidebar,
    changeTab
  } = props;
  // state
  const [valueUSD, setValueUSD] = useState<number>();
  const [valueSOL, setValueSOL] = useState<number>();
  const [sliderValue, setSliderValue] = useState(0);
  const { toast, ToastComponent } = useToast();
  // constants && calculations
  const maxValue = userDebt != 0 ? userDebt : userAllowance;
  const reservePrice = fetchedReservePrice;
  const liquidationThreshold = COLLATERAL_FACTOR;
  const bonkBalance = 0; //FETCH FROM WALLET
  const newDebt = userDebt - (valueSOL ? valueSOL : 0);
  const borrowedValue = userDebt;
  const liquidationPrice = userDebt / liquidationThreshold;
  const newLiquidationPrice = newDebt / liquidationThreshold;
  const liqPercent = nftPrice
    ? ((nftPrice - liquidationPrice) / nftPrice) * 100
    : 0;
  const newLiqPercent = nftPrice
    ? ((nftPrice - newLiquidationPrice) / nftPrice) * 100
    : 0;
  const sdkConfig = ConfigureSDK();

  // Put your validators here
  const isRepayButtonDisabled = () => {
    return false;
  };
  // change of input - render calculated values
  const handleSliderChange = (value: number) => {
    if (userDebt <= 0) return;

    setSliderValue(value);
    setValueUSD(value * reservePrice);
    setValueSOL(value);
  };
  // change of input - render calculated values
  const handleUsdInputChange = (usdValue: number | undefined) => {
    if (!usdValue || userDebt <= 0) {
      setValueUSD(0);
      setValueSOL(0);
      setSliderValue(0);
      return;
    }
    setValueUSD(usdValue);
    setValueSOL(usdValue / reservePrice);
    setSliderValue(usdValue / reservePrice);
  };
  // change of input - render calculated values
  const handleSolInputChange = (solValue: number | undefined) => {
    if (!solValue || userDebt <= 0) {
      setValueUSD(0);
      setValueSOL(0);
      setSliderValue(0);
      return;
    }

    setValueUSD(solValue * reservePrice);
    setValueSOL(solValue);
    setSliderValue(solValue);
  };
  // executes repay function - changes tab state to borrow if changeTab exists
  const onRepay = async (event: any) => {
    if (userDebt == 0 && openPositions[0]) {
      executeWithdrawNFT(openPositions[0].mint, toast);
      // if (changeTab) {
      //   changeTab('borrow');
      // }
    } else {
      const metadata = await Metadata.findByMint(
        sdkConfig.saberHqConnection,
        openPositions[0].mint
      );
      executeRepay(valueSOL || 0, metadata.pubkey, toast);
      handleSliderChange(0);
    }
  };

  return (
    <SidebarScroll
      footer={
        <>
          {toast?.state ? (
            <ToastComponent />
          ) : (
            <div className={styles.buttons}>
              <div className={styles.smallCol}>
                <HoneyButton variant="secondary" onClick={hideMobileSidebar}>
                  Cancel
                </HoneyButton>
              </div>
              <div className={styles.bigCol}>
                <HoneyButton
                  variant="primary"
                  solAmount={userDebt > 0 ? valueSOL || 0 : undefined}
                  usdcValue={userDebt > 0 ? valueUSD || 0 : undefined}
                  disabled={isRepayButtonDisabled()}
                  block
                  onClick={onRepay}
                >
                  {userDebt > 0 ? 'Repay' : 'Claim NFT'}
                </HoneyButton>
              </div>
            </div>
          )}
        </>
      }
    >
      <div className={styles.repayForm}>
        <div className={styles.nftInfo}>
          <div className={styles.nftImage}>
            <HexaBoxContainer>
              {openPositions.length ? (
                <Image
                  src={openPositions[0].image}
                  alt="Honey NFT image"
                  layout="fill"
                />
              ) : (
                renderMarketImageByID(currentMarketId)
              )}
            </HexaBoxContainer>
          </div>
          <div className={styles.nftName}>{openPositions[0].name}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fsn(nftPrice ?? 0)}
              valueSize="big"
              title={
                <span className={hAlign}>
                  Estimated value <div className={questionIcon} />
                </span>
              }
              toolTipLabel={
                <span>
                  The worth of your collateral according to the market’s oracle.
                  Learn more about this market’s{' '}
                  <a
                    className={extLink}
                    target="blank"
                    href="https://switchboard.xyz/explorer"
                  >
                    Switchboard data-feed.
                  </a>
                </span>
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={fsn(userAllowance / BONK_DECIMAL_DIVIDER_MIL)}
              title={
                <span className={hAlign}>
                  Allowance <div className={questionIcon} />
                </span>
              }
              toolTipLabel={`Allowance determines how much debt is available to a borrower. This market supports no more than ${fp(
                60
              )}`}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={fp(loanToValue * 100)}
              toolTipLabel={
                <span>
                  <a
                    className={extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#loan-to-value-ratio"
                  >
                    Loan-to-value ratio{' '}
                  </a>
                  measures the ratio of the debt, compared to the value of the
                  collateral.
                </span>
              }
              title={
                <span className={hAlign}>
                  Loan-to-Value %
                  <div className={questionIcon} />
                </span>
              }
            />

            <HoneySlider
              currentValue={0}
              maxValue={nftPrice || 0}
              minAvailableValue={borrowedValue}
              maxSafePosition={0.3 - borrowedValue / 1000}
              dangerPosition={0.45 - borrowedValue / 1000}
              maxAvailablePosition={MAX_LTV}
              isReadonly
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New LTV %<div className={questionIcon} />
                </span>
              }
              value={fp((newDebt / (nftPrice || 0)) * 100)}
              isDisabled={userDebt == 0 ? true : false}
              toolTipLabel={
                <span>
                  New{' '}
                  <a
                    className={extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#loan-to-value-ratio"
                  >
                    Loan-to-value ratio{' '}
                  </a>
                  after the requested changes to the loan are approved.
                </span>
              }
            />

            <HoneySlider
              currentValue={0}
              maxValue={nftPrice || 0}
              minAvailableValue={newDebt}
              maxSafePosition={0.3 - borrowedValue / 1000}
              dangerPosition={0.45 - borrowedValue / 1000}
              maxAvailablePosition={MAX_LTV}
              isReadonly
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  Debt
                  <div className={questionIcon} />
                </span>
              }
              value={fsn(userDebt)}
              toolTipLabel={
                <span>
                  Value borrowed from the lending pool, upon which interest
                  accrues.{' '}
                  <a
                    className={extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#debt"
                  >
                    Learn more.
                  </a>
                </span>
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              title={
                <span className={hAlign}>
                  New debt
                  <div className={questionIcon} />
                </span>
              }
              value={fsn(newDebt < 0 ? 0 : newDebt)}
              isDisabled={userDebt == 0 ? true : false}
              toolTipLabel={
                <span>
                  Estimated{' '}
                  <a
                    className={extLink}
                    target="blank"
                    href="https://docs.honey.finance/learn/defi-lending#debt"
                  >
                    debt{' '}
                  </a>
                  after the requested changes to the loan are approved.
                </span>
              }
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={`${fsn(liquidationPrice)} ${
                userDebt ? `(-${liqPercent.toFixed(0)}%)` : ''
              }`}
              valueSize="normal"
              isDisabled={userDebt == 0 ? true : false}
              title={
                <span className={hAlign}>
                  Liquidation price <div className={questionIcon} />
                </span>
              }
              toolTipLabel={
                <span>
                  Price at which the position (NFT) will be liquidated.{' '}
                  <a
                    className={extLink}
                    target="blank"
                    href=" " //TODO: add link to docs
                  >
                    Learn more.
                  </a>
                </span>
              }
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              isDisabled={userDebt == 0 ? true : false}
              title={
                <span className={hAlign}>
                  New Liquidation price <div className={questionIcon} />
                </span>
              }
              toolTipLabel={
                <span>
                  Estimated{' '}
                  <a
                    className={extLink}
                    target="blank"
                    href=" " //TODO: add link to docs
                  >
                    liquidation Price
                  </a>{' '}
                  after the requested changes to the loan are approved.
                </span>
              }
              value={`${fsn(newLiquidationPrice)} ${
                userDebt ? `(-${newLiqPercent?.toFixed(0)}%)` : ''
              }`}
              valueSize="normal"
            />
          </div>
        </div>

        <div className={styles.inputs}>
          <div className={styles.row}>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                title={'Your BONK balance'}
                value={fsn(Number(frd(bonkBalance, 3)))}
              ></InfoBlock>
            </div>
            <div className={cs(styles.balance, styles.col)}>
              <InfoBlock
                isDisabled={userDebt == 0 ? true : false}
                title={'NEW BONK balance'}
                value={fsn(Number(frd(bonkBalance - (valueSOL || 0), 3)))}
              ></InfoBlock>
            </div>
          </div>
          <InputsBlock
            firstInputValue={Number(valueSOL?.toFixed())}
            secondInputValue={Number(valueUSD?.toFixed())}
            onChangeFirstInput={handleSolInputChange}
            onChangeSecondInput={handleUsdInputChange}
            firstInputAddon={
              <Space align="center">
                <div
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    width: 20,
                    height: 20
                  }}
                >
                  <Image src={BonkIcon} width="100%" height="100%" />
                </div>
                BONK
              </Space>
            }
          />
        </div>

        <HoneySlider
          currentValue={sliderValue}
          maxValue={maxValue}
          minAvailableValue={0}
          onChange={handleSliderChange}
        />
      </div>
    </SidebarScroll>
  );
};

export default RepayForm;
