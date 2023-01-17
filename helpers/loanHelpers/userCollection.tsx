import { RoundHalfDown, RoundHalfUp } from 'helpers/utils';
import { MAX_LTV } from '../../constants/loan';
import BN from 'bn.js';
import { getOraclePrice } from '../../helpers/loanHelpers/index';
import {
  OPTIMAL_RATIO_ONE,
  OPTIMAL_RATIO_TWO,
  MAX_UTILISATION_RATIO,
  BASE_BORROW_RATE,
  DISCOUNTED_BORROW_RATE,
  BORROW_RATE_ONE,
  BORROW_RATE_TWO,
  BORROW_RATE_THREE
} from '../../constants/interestRate';
import { network } from 'pages/_app';
import { ConnectedWallet } from '@saberhq/use-solana';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
} from '@solana/web3.js';
import { BONK_DECIMAL_DIVIDER } from 'constants/market';

import * as anchor from '@project-serum/anchor';
import {
  CollateralNFTPosition,
  getHealthStatus,
  getNFTAssociatedMetadata,
  HoneyClient,
  HoneyMarket,
  HoneyReserve,
  HoneyUser,
  LoanPosition,
  METADATA_PROGRAM_ID,
  NftPosition,
  ObligationAccount,
  ObligationPositionStruct,
  PositionInfoList,
  TReserve,
  borrowAndRefresh,
  depositNFT,
  repayAndRefresh,
  useBorrowPositions,
  useHoney,
  useMarket,
  fetchAllMarkets,
  MarketBundle,
  waitForConfirmation,
  withdrawNFT,
  fetchReservePrice,
  ReserveConfigStruct,
  MarketAccount,
  CachedReserveInfo
} from '@honey-finance/sdk';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { formatNumber } from '../../helpers/format';
import { generateMockHistoryData } from 'helpers/chartUtils';
import { MarketTableRow } from 'types/markets';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import {
  renderMarketName,
  marketCollections,
  COLLATERAL_FACTOR,
  HONEY_GENESIS_MARKET_ID
} from 'helpers/marketHelpers';
import { toast } from 'react-toastify';

/**
 * @description formatting functions to format with perfect / format in SOL with icon or just a regular 2 decimal format
 * @params value to be formatted
 * @returns requested format
 */
const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;

export async function fetchLTV(totalMarketDebt: number, nftPrice: number) {
  if (nftPrice === 0) return 0;
  return totalMarketDebt / nftPrice;
}

// filters out zero debt obligations and multiplies outstanding obl. by nft price
export async function fetchTVL(obligations: any) {
  if (!obligations.length) return 0;
  return obligations.filter((obl: any) => obl.debt !== 0).length;
}

/**
 * @description pollutes the chart on lend with dummy historic rates
 * @params none
 * @returns chart data
 */
const getPositionData = () => {
  const isMock = true;

  if (isMock) {
    const from = new Date().setFullYear(new Date().getFullYear() - 1).valueOf();
    const to = new Date().valueOf();
    return generateMockHistoryData(from, to);
  }
  return [];
};
/**
 * @description fetches the sol price from switchboard
 * @params marketreserve | parsedreserve | honeymarket | connection
 * @returns the current sol price
 */
export async function fetchSolPrice(parsedReserves: any, connection: any) {
  if (parsedReserves && connection) {
    try {
      let solPrice = await getOraclePrice(
        network === 'devnet' ? 'devnet' : 'mainnet-beta',
        connection,
        parsedReserves[0].switchboardPriceAggregator
      );
      return solPrice;
    } catch (error) {
      throw error;
    }
  }
}
/**
 * @description sets the obligations for the liquidation page of a collection and filters out obligations with zero debt
 * @params obligations array, currentmarketid. nft
 * @returns chart data
 */
const setObligations = async (
  obligations: any,
  currentMarketId: string,
  nftPrice: number
) => {
  if (!obligations) return [];

  return obligations
    .map((obligation: any) => {
      return {
        name: renderMarketName(currentMarketId),
        riskLvl: (obligation.debt / nftPrice) * 100,
        healthLvl:
          ((nftPrice - obligation.debt / COLLATERAL_FACTOR) / nftPrice) * 100,
        debt: obligation.debt,
        estimatedValue: nftPrice,
        nftMint: obligation.nft_mint,
        owner: obligation.owner,
        obligation: obligation.obligation,
        highestBid: obligation.highest_bid
      };
    })
    .filter((obl: any) => obl.debt !== 0);
};
/**
 * @description calculates the risk of a market
 * @params array of obligations | nft price | boolean: false will calculate the risk - true will calculate the total debt | market id | name of collection
 * @returns total debt of market if type is true, risk of market if type is false
 */
const calculateRisk = async (
  obligations: any,
  nftPrice: number,
  type: boolean,
  collection: string
) => {
  if (!obligations) return 0;
  let filtered = await obligations.filter((obl: any) => obl.debt !== 0);
  let sumOfDebt = await filtered.reduce((acc: number, obligation: any) => {
    return acc + obligation.debt;
  }, 0);

  if (type === true) {
    return sumOfDebt;
  } else {
    return sumOfDebt / filtered.length / nftPrice;
  }
};
/**
 * @description calculates the debt of all the obligations
 * @params obligation array
 * @returns debt of market of all obligations
 */
async function calculateTotalDebt(obligations: any) {
  if (obligations.length) {
    const sumOfMarketDebt = await obligations.reduce(
      (acc: number, obl: any) => {
        return acc + obl.debt;
      },
      0
    );
    return sumOfMarketDebt;
  }
}
// calculate total market debt for collection
// async function calculateTotalMarketDebt(parsedReserve: TReserve) {
//   return RoundHalfDown(
//     parsedReserve.reserveState.outstandingDebt
//       .div(new BN(10 ** 15))
//       .toNumber() / BONK_DECIMAL_DIVIDER
//   );
// }
// sets total market debt, total market deposits, decodes parsed reserve
// export async function decodeReserve(
//   honeyMarket: HoneyMarket,
//   honeyClient: HoneyClient,
//   parsedReserves: TReserve
// ) {
//   try {
//     // set reserve data
//     const reserveInfoList = honeyMarket.reserves;
//     let parsedReserve: TReserve = parsedReserves;
//     let totalMarketDeposits = 0;

//     for (const reserve of reserveInfoList) {
//       if (reserve.reserve.equals(PublicKey.default)) {
//         continue;
//       }

//       const { ...data } = await HoneyReserve.decodeReserve(
//         honeyClient,
//         reserve.reserve
//       );

//       parsedReserve = data;
//       break;
//     }

//     if (parsedReserve !== undefined) {
//       totalMarketDeposits = BnToDecimal(
//         parsedReserve.reserveState.totalDeposits,
//         9,
//         2
//       );
//     }

//     const totalMarketDebt = await calculateTotalMarketDebt(parsedReserve);
//     return {
//       totalMarketDebt,
//       totalMarketDeposits,
//       parsedReserve
//     };
//   } catch (error) {
//     return {
//       totalMarketDebt: 0,
//       totalMarketDeposits: 0
//     };
//   }
// }

async function handleFormatMarket(
  origin: string,
  collection: any,
  currentMarketId: string,
  liquidations: boolean,
  obligations: any,
  honeyUser: HoneyUser,
  honeyClient: HoneyClient,
  honeyMarket: HoneyMarket,
  connection: Connection,
  parsedReserves: TReserve,
  mData?: any
) {
  const totalMarketDebt = mData ? mData.outstandingDebt : 0;
  const totalMarketDeposits = mData ? mData.totalDeposits : 0;
  const totalMarketValue = new BN(totalMarketDeposits).toString();
  const nftPrice = await honeyMarket.fetchNFTFloorPrice('mainnet-beta');
  collection.nftPrice = nftPrice;

  console.log('xyz - nft price afla', nftPrice);
  console.log('xyz - nft price beta', nftPrice / BONK_DECIMAL_DIVIDER);

  const allowanceAndDebt = await honeyUser.fetchAllowanceAndDebt(
    0,
    'mainnet-beta'
  );

  console.log('xyz - nft price gamma', allowanceAndDebt?.allowance.toString());

  // const ltv = sumOfTotalDebt.div(new BN(nftPrice));
  const tvl = new BN(nftPrice * (await fetchTVL(obligations)));
  const ltv = honeyMarket.fetchLTV();
  const userTotalDeposits = await honeyUser.fetchUserDeposits(0);

  // if request comes from liquidation page we need the collection object to be different
  if (origin === 'LIQUIDATIONS') {
    collection.name;

    collection.allowance = allowanceAndDebt.allowance;
    collection.userDebt = allowanceAndDebt.debt;
    collection.available = totalMarketDeposits;
    collection.value = totalMarketValue;
    collection.connection = connection;
    // TODO: fix util rate based off object coming in
    collection.utilizationRate = Number(
      f(totalMarketDebt / (totalMarketDeposits + totalMarketDebt))
    );
    collection.user = honeyUser;
    collection.nftPrice = nftPrice;
    collection.ltv = ltv;
    collection.tvl = tvl;

    collection.risk = obligations
      ? await calculateRisk(obligations, collection.nftPrice, false, collection)
      : 0;
    collection.totalDebt = totalMarketDebt;
    collection.openPositions = obligations
      ? await setObligations(obligations, currentMarketId, collection.nftPrice)
      : [];
    // if there are open positions in the collections, calculate until liquidation value
    if (collection.openPositions) {
      collection.openPositions.map((openPos: any) => {
        return (openPos.untilLiquidation =
          openPos.estimatedValue - openPos.debt / COLLATERAL_FACTOR);
      });
    }

    // request comes from borrow or lend - same base collection object
  } else if (origin === 'BORROW') {
    console.log(allowanceAndDebt);
    collection.allowance = allowanceAndDebt
      ? allowanceAndDebt.allowance.toString()
      : 0;
    collection.userDebt = allowanceAndDebt
      ? allowanceAndDebt.debt.toString()
      : 0;
    collection.ltv = ltv;
    collection.available = totalMarketDeposits.toString();
    collection.value = totalMarketValue.toString();
    collection.connection = connection;
    collection.nftPrice = nftPrice;
    // TODO: fix util rate based off object coming in
    collection.utilizationRate = Number(
      f(totalMarketDebt / (totalMarketDeposits + totalMarketDebt))
    );
    collection.user = honeyUser;
    collection.name;
    return collection;
  } else if (origin === 'LEND') {
    collection.allowance = allowanceAndDebt
      ? allowanceAndDebt.allowance.toString()
      : 0;
    collection.userDebt = allowanceAndDebt
      ? allowanceAndDebt.debt.toString()
      : 0;
    collection.ltv = ltv;
    collection.available = totalMarketDeposits;
    collection.value = totalMarketValue;
    collection.connection = connection;
    collection.nftPrice = nftPrice;
    collection.userTotalDeposits = userTotalDeposits;
    // TODO: fix util rate based off object coming in
    collection.utilizationRate = Number(
      f(totalMarketDebt / (totalMarketDeposits + totalMarketDebt))
    );
    collection.user = honeyUser;
    collection.name;
    return collection;
  }
}

/**
 * @description Being called for each collection in the array, calculates the collections values
 * @params collection | connection | wallet | market id | boolean (if request comes from liquidation page) | array of obligations
 * @returns collection object
 */
export async function populateMarketData(
  origin: string,
  collection: MarketTableRow,
  connection: Connection,
  wallet: ConnectedWallet | null,
  currentMarketId: string,
  liquidations: boolean,
  obligations: any,
  hasMarketData: boolean,
  honeyClient?: HoneyClient,
  honeyMarket?: HoneyMarket,
  honeyUser?: HoneyUser,
  parsedReserves?: TReserve,
  mData?: any
) {
  // create dummy keypair if no wallet is connected to fetch values of the collections regardless of connected wallet
  let dummyWallet = wallet ? wallet : new NodeWallet(new Keypair());
  // since we inject the market id at top level (app.tsx) we need to create a new provider, init new honeyClient and market, for each market
  console.log('@@xyz', hasMarketData);
  console.log('@@xyz', honeyClient);
  console.log('@@xyz', honeyMarket);
  console.log('@@xyz', honeyUser);
  console.log('@@xyz', parsedReserves);

  if (
    hasMarketData &&
    honeyClient &&
    honeyMarket &&
    honeyUser &&
    parsedReserves
  ) {
    return await handleFormatMarket(
      origin,
      collection,
      currentMarketId,
      liquidations,
      obligations,
      honeyUser,
      honeyClient,
      honeyMarket,
      connection,
      parsedReserves,
      mData
    );
  }
}
