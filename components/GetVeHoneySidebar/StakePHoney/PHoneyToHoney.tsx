import React, { FC, useState, useCallback, useMemo } from 'react';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import SidebarScroll from 'components/SidebarScroll/SidebarScroll';
import HoneyWarning from 'components/HoneyWarning/HoneyWarning';
import SectionTitle from 'components/SectionTitle/SectionTitle';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HoneyFormattedNumericInput from 'components/HoneyFormattedNumericInput/HoneyFormattedInput';
import { useAccountByMint, useAccounts } from 'hooks/useAccounts';
import { useStake, useLocker } from 'hooks/useVeHoney';
import { formatNumber } from 'helpers/format';
import { convert, convertToBN, isNil } from 'helpers/utils';
import * as styles from '../LockHoneyForm/LockHoneyForm.css';
import { hAlign } from 'styles/common.css';
import { TokenAmount } from '@saberhq/token-utils';

const { format: f, formatPercent: fp, formatUsd: fu, parse: p } = formatNumber;

const PHoneyToHoney = (props: { onCancel: Function }) => {
  const [phoneyValue1, setPHoneyValue1] = useState<number>();

  const { preToken, govToken, user, claimableAmount, deposit, vest, claim } =
    useStake();
  const { escrow, votingPower, locker } = useLocker();
  const pHoneyAccount = useAccountByMint(preToken?.mintAccount);

  const pHoneyAmount = useMemo(() => {
    if (!preToken || !pHoneyAccount) return null;
    return new TokenAmount(preToken, pHoneyAccount.data.amount);
  }, [preToken, pHoneyAccount]);

  const depositedAmount = useMemo(() => {
    if (!preToken || !user) return null;
    return new TokenAmount(preToken, user.data.depositAmount);
  }, [preToken, user]);

  const claimedAmount = useMemo(() => {
    if (!govToken || !user) return null;
    return new TokenAmount(govToken, user.data.claimedAmount);
  }, [govToken, user]);

  const defaultInputFormatted = (value: ValueType | undefined) => {
    // TODO: pass decimals as props if needed
    return value ? formatNumber.formatTokenInput(String(value), 9) : '';
  };

  const handlePHoneyValueChange1 = (value: ValueType | null) => {
    if (isNil(value)) {
      setPHoneyValue1(undefined);
    } else {
      setPHoneyValue1(Number(value));
    }
  };

  const handleDeposit = useCallback(async () => {
    if (phoneyValue1 && preToken) {
      await deposit(convertToBN(phoneyValue1, preToken.decimals));
      setPHoneyValue1(undefined);
    }
  }, [phoneyValue1, preToken]);

  return (
    <SidebarScroll
      footer={
        <div className={styles.buttons}>
          <div className={styles.smallCol}>
            <HoneyButton variant="secondary" onClick={() => {}}>
              Cancel
            </HoneyButton>
          </div>

          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={
                !phoneyValue1 || phoneyValue1 > (pHoneyAmount?.asNumber ?? 0)
              }
              block
              onClick={handleDeposit}
            >
              Deposit
            </HoneyButton>
          </div>
          <div className={styles.bigCol}>
            <HoneyButton
              variant="primary"
              disabled={!claimableAmount?.asNumber}
              block
              onClick={claim}
            >
              Claim
            </HoneyButton>
          </div>
        </div>
      }
    >
      <div className={styles.depositForm}>
        <SectionTitle
          title="Deposit pHONEY and receive HONEY"
          className={styles.mb10}
        />
        <div className={styles.row}>
          <div className={styles.col}>
            <HoneyWarning message="Deposit and burn $pHoney tokens to claim the same amount of $Honey daily basis for 21 days." />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={f(pHoneyAmount?.asNumber)}
              title={<span className={hAlign}>$pHONEY balance</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={f(depositedAmount?.asNumber)}
              title={<span className={hAlign}>$pHONEY deposited</span>}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <InfoBlock
              value={f(claimedAmount?.asNumber)}
              title={<span className={hAlign}>$HONEY claimed</span>}
            />
          </div>
          <div className={styles.col}>
            <InfoBlock
              value={f(claimableAmount?.asNumber)}
              title={<span className={hAlign}>$HONEY claimable today</span>}
            />
          </div>
        </div>

        <div className={styles.divider} />
        <div>
          <HoneyFormattedNumericInput
            placeholder="0.00"
            decimalSeparator="."
            formatter={defaultInputFormatted}
            onChange={handlePHoneyValueChange1}
            addonAfter="PHONEY"
          />
        </div>
      </div>
    </SidebarScroll>
  );
};

export default PHoneyToHoney;
