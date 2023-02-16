import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import LendSidebar from '../../components/LendSidebar/LendSidebar';
import { LendTableRow } from '../../types/lend';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import * as style from '../../styles/markets.css';
import c from 'classnames';
import { ColumnType } from 'antd/lib/table';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import { Key } from 'antd/lib/table/interface';
import { formatNumber } from '../../helpers/format';
import SearchInput from '../../components/SearchInput/SearchInput';
import debounce from 'lodash/debounce';
import { getColumnSortStatus } from '../../helpers/tableUtils';
import HoneySider from '../../components/HoneySider/HoneySider';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import { RoundHalfDown } from 'helpers/utils';
import {
  deposit,
  withdraw,
  useMarket,
  useHoney,
  fetchAllMarkets,
  MarketBundle,
  waitForConfirmation,
  fetchReservePrice,
  TReserve
} from '@honey-finance/sdk';
import { BnToDecimal, ConfigureSDK } from '../../helpers/loanHelpers/index';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import {
  calcNFT,
  fetchSolPrice,
  populateMarketData
} from 'helpers/loanHelpers/userCollection';
import { ToastProps } from 'hooks/useToast';
import { Typography } from 'antd';
import { pageDescription, pageTitle } from 'styles/common.css';
import HoneyTableNameCell from 'components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';

import {
  HONEY_GENESIS_BEE_MARKET_NAME,
  HONEY_PROGRAM_ID,
  marketIDs,
  ROOT_CLIENT,
  ROOT_SSR
} from '../../helpers/marketHelpers';
import { HONEY_GENESIS_MARKET_ID } from '../../helpers/marketHelpers/index';
import { marketCollections } from '../../helpers/marketHelpers';
import { generateMockHistoryData } from '../../helpers/chartUtils';
import { renderMarket, renderMarketImageByName } from 'helpers/marketHelpers';
// TODO: fetch based on config
const network = 'mainnet-beta';

const createMarketObject = async (marketData: any) => {
  try {
    return Promise.all(
      marketData.map(async (marketObject: any) => {
        const marketId = marketObject.market.address.toString();
        const { utilization, interestRate } =
          await marketObject.reserves[0].getUtilizationAndInterestRate();
        const totalMarketDebt =
          await marketObject.reserves[0].getReserveState();
        const totalMarketDeposits =
          await marketObject.reserves[0].getReserveState().totalDeposits;
        const nftPrice = await marketObject.market.fetchNFTFloorPriceInReserve(
          0
        );
        const allowanceAndDebt = await marketObject.user.fetchAllowanceAndDebt(
          0,
          'mainnet-beta'
        );

        const allowance = await allowanceAndDebt.allowance;
        const liquidationThreshold =
          await allowanceAndDebt.liquidationThreshold;
        const ltv = await allowanceAndDebt.ltv;
        const ratio = await allowanceAndDebt.ratio.toString();

        const positions = marketObject.positions.map((pos: any) => {
          return {
            obligation: pos.obligation,
            debt: pos.debt,
            owner: pos.owner.toString(),
            ltv: pos.ltv,
            is_healthy: pos.is_healthy,
            highest_bid: pos.highest_bid,
            verifiedCreator: pos.verifiedCreator.toString()
          };
        });

        return {
          marketId,
          utilization: utilization,
          interestRate: interestRate,
          totalMarketDebt: totalMarketDebt,
          totalMarketDeposits: totalMarketDeposits,
          // totalMarketValue: totalMarketDebt + totalMarketDeposits,
          nftPrice: nftPrice,
          allowance,
          liquidationThreshold,
          ltv,
          ratio,
          positions
        };
      })
    );
  } catch (error) {
    return {};
  }
};

export async function getServerSideProps() {
  const createConnection = () => {
    // @ts-ignore
    return new Connection(process.env.NEXT_PUBLIC_RPC_NODE, 'mainnet-beta');
  };
  const response = await fetchAllMarkets(
    createConnection(),
    null,
    HONEY_PROGRAM_ID,
    marketIDs,
    false
  );

  return createMarketObject(response).then(res => {
    return {
      props: { res, revalidate: 30 }
    };
  });
}
// @ts-ignore
const Lend: NextPage = ({ res }: { res: any }) => {
  // market specific constants - calculations / ratios / debt / allowance etc.
  const [userTotalDeposits, setUserTotalDeposits] = useState<number>(0);
  const [reserveHoneyState, setReserveHoneyState] = useState(0);
  const [nftPrice, setNftPrice] = useState(0);
  const [userWalletBalance, setUserWalletBalance] = useState<number>(0);
  const [fetchedSolPrice, setFetchedSolPrice] = useState(0);
  const [activeMarketSupplied, setActiveMarketSupplied] = useState(0);
  const [activeMarketAvailable, setActiveMarketAvailable] = useState(0);
  const isMock = true;
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);
  const [activeInterestRate, setActiveInterestRate] = useState(0);
  const [tableData, setTableData] = useState<LendTableRow[]>([]);
  const [fetchedDataObject, setFetchedDataObject] = useState<MarketBundle>();
  const [tableDataFiltered, setTableDataFiltered] = useState<LendTableRow[]>(
    []
  );
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMyCollectionsFilterEnabled, setIsMyCollectionsFilterEnabled] =
    useState(false);
  const [honeyReservesChange, setHoneyReservesChange] = useState(0);
  // Sets market ID which is used for fetching market specific data
  // each market currently is a different call and re-renders the page
  const [currentMarketId, setCurrentMarketId] = useState(
    HONEY_GENESIS_MARKET_ID
  );
  const [currentMarketName, setCurrentMarketName] = useState(
    HONEY_GENESIS_BEE_MARKET_NAME
  );
  // init wallet and sdkConfiguration file
  const sdkConfig = ConfigureSDK();
  let walletPK = sdkConfig.sdkWallet?.publicKey;

  const [marketData, setMarketData] = useState<MarketBundle[]>([]);
  // current active market based on client side fetch
  const [activeMarket, setActiveMarket] = useState<MarketBundle[]>();
  const [clientMarketData, setClientMarketData] = useState<MarketBundle[]>();

  useEffect(() => {
    setMarketData(res as unknown as MarketBundle[]);
  }, [res]);

  // fetch all markets based on market id (client side fetch)
  async function fetchClientSideMarketData() {
    const data = await fetchAllMarkets(
      sdkConfig.saberHqConnection,
      sdkConfig.sdkWallet,
      HONEY_PROGRAM_ID,
      marketIDs
    );

    // set the state
    setClientMarketData(data as unknown as MarketBundle[]);

    setTimeout(() => {
      data.map(market => {
        if (market.market.address.toString() === currentMarketId) {
          setActiveMarket([market]);
        }
      });
    }, 2500);
  }

  useEffect(() => {
    fetchClientSideMarketData();
  }, []);

  /**
   * @description sets the market ID based on market click
   * @params Honey table record - contains all info about a table (aka market)
   * @returns sets the market ID which re-renders page state and fetches market specific data
   */
  async function handleMarketId(record: any) {
    const marketData = renderMarket(record.id);
    setCurrentMarketId(marketData[0].id);
    setCurrentMarketName(marketData[0].name);

    const filteredClientMarketdata = clientMarketData?.filter(
      market => market.market.address.toString() === record.id
    );

    setActiveMarket(filteredClientMarketdata);
  }

  /**
   * @description formatting functions to format with perfect / format in SOL with icon or just a regular 2 decimal format
   * @params value to be formatted
   * @returns requested format
   */
  const { format: f, formatPercent: fp, formatSol: fs } = formatNumber;

  // ************* HOOKS *************
  /**
   * @description calls upon markets which
   * @params none
   * @returns market | market reserve information | parsed reserves |
   */
  const { marketReserveInfo, parsedReserves, fetchMarket } = useHoney();

  //  ************* START FETCH USER BALANCE *************
  // fetches the users balance
  async function fetchWalletBalance(key: PublicKey) {
    try {
      const userBalance =
        (await sdkConfig.saberHqConnection.getBalance(key)) / LAMPORTS_PER_SOL;
      setUserWalletBalance(userBalance);
    } catch (error) {
      console.log('Error', error);
    }
  }

  useEffect(() => {
    if (walletPK) fetchWalletBalance(walletPK);
  }, [walletPK]);
  //  ************* END FETCH USER BALANCE *************

  //  ************* START FETCH CURRENT SOL PRICE *************
  // fetches the current sol price
  async function fetchSolValue(reserves: TReserve, connection: Connection) {
    const slPrice = await fetchReservePrice(reserves, connection);
    setFetchedSolPrice(slPrice);
  }

  /**
   * @description sets state of marketValue by parsing lamports outstanding debt amount to SOL
   * @params none, requires parsedReserves
   * @returns updates marketValue
   */
  useEffect(() => {
    if (parsedReserves) {
      fetchSolValue(parsedReserves[0], sdkConfig.saberHqConnection);
    }
  }, [parsedReserves]);
  //  ************* END FETCH CURRENT SOL PRICE *************

  /**
   * @description deposits X amount of SOL from market
   * @params value: being amount to withdraw | toast: notifications
   * @returns succes | failure
   */
  async function executeDeposit(value?: number, toast?: ToastProps['toast']) {
    if (!toast) return;
    try {
      if (!value) return toast.error('Deposit failed');

      toast.processing();
      if (activeMarket) {
        const tokenAmount = new BN(value * LAMPORTS_PER_SOL);
        const depositTokenMint = new PublicKey(
          'So11111111111111111111111111111111111111112'
        );

        const tx = await deposit(
          activeMarket[0].user,
          tokenAmount,
          depositTokenMint,
          activeMarket[0].reserves
        );

        if (tx[0] == 'SUCCESS') {
          const confirmation = tx[1];
          const confirmationHash = confirmation[0];

          await waitForConfirmation(
            sdkConfig.saberHqConnection,
            confirmationHash
          );

          await fetchMarket();

          await activeMarket[0].reserves[0].refresh();
          await activeMarket[0].user.refresh();

          if (walletPK) await fetchWalletBalance(walletPK);
          honeyReservesChange === 0
            ? setHoneyReservesChange(1)
            : setHoneyReservesChange(0);

          toast.success(
            'Deposit success',
            `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
          );
        } else {
          return toast.error('Deposit failed');
        }
      } else {
        return toast.error('Please select a market');
      }
    } catch (error) {
      return toast.error('Deposit failed', error);
    }
  }
  /**
   * @description withdraws X amount of SOL from market
   * @params value: being amount to withdraw | toast: notifications
   * @returns succes | failure
   */
  async function executeWithdraw(value: number, toast?: ToastProps['toast']) {
    if (!toast) return;
    try {
      if (!value) return toast.error('Withdraw failed');

      toast.processing();
      if (activeMarket) {
        const tokenAmount = new BN(value * LAMPORTS_PER_SOL);
        const depositTokenMint = new PublicKey(
          'So11111111111111111111111111111111111111112'
        );

        const tx = await withdraw(
          activeMarket[0].user,
          tokenAmount,
          depositTokenMint,
          activeMarket[0].reserves
        );

        if (tx[0] == 'SUCCESS') {
          const confirmation = tx[1];
          const confirmationHash = confirmation[0];

          await waitForConfirmation(
            sdkConfig.saberHqConnection,
            confirmationHash
          );

          await fetchMarket();

          await activeMarket[0].reserves[0].refresh();
          await activeMarket[0].user.refresh();

          if (walletPK) await fetchWalletBalance(walletPK);

          honeyReservesChange === 0
            ? setHoneyReservesChange(1)
            : setHoneyReservesChange(0);

          toast.success(
            'Deposit success',
            `https://solscan.io/tx/${tx[1][0]}?cluster=${network}`
          );
        } else {
          return toast.error('Withdraw failed ');
        }
      } else {
        return toast.error('Please select a market');
      }
    } catch (error) {
      return toast.error('Withdraw failed ');
    }
  }

  const hideMobileSidebar = () => {
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };
  /**
   * @description
   * @params
   * @returns
   */
  const getPositionData = () => {
    if (isMock) {
      const from = new Date()
        .setFullYear(new Date().getFullYear() - 1)
        .valueOf();
      const to = new Date().valueOf();
      return generateMockHistoryData(from, to);
    }
    return [];
  };

  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  /**
   * @description inits each market with their data | happening in userCollection.tsx
   * @params none
   * @returns market object filled with data
   */
  useEffect(() => {
    if (sdkConfig.saberHqConnection) {
      function getData() {
        return Promise.all(
          marketCollections.map(async collection => {
            if (collection.id == '') return collection;
            // runs only for one market in the array - the active one
            if (
              activeMarket &&
              collection.id === activeMarket[0].market.address.toString()
            ) {
              collection.marketData = activeMarket;
              await populateMarketData(
                'LEND',
                collection,
                currentMarketId,
                collection.marketData[0].positions,
                true,
                ROOT_CLIENT,
                activeMarket[0].user
              );

              collection.stats = getPositionData();

              setActiveInterestRate(collection.rate);
              setActiveMarketSupplied(collection.value);
              setActiveMarketAvailable(collection.available);
              setNftPrice(RoundHalfDown(Number(collection.nftPrice)));
              setFetchedDataObject(collection.marketData[0]);
              collection.userTotalDeposits
                ? setUserTotalDeposits(collection.userTotalDeposits)
                : setUserTotalDeposits(0);

              return collection;
              // runs for all the markets in the array - you can only expand the market (to set active market)
              // once data is loaded
            } else if (
              !activeMarket &&
              clientMarketData &&
              clientMarketData.length
            ) {
              collection.marketData = clientMarketData.filter(
                marketObject =>
                  marketObject.market.address.toString() === collection.id
              );

              await populateMarketData(
                'LEND',
                collection,
                currentMarketId,
                collection.marketData[0].positions,
                true,
                ROOT_CLIENT,
                collection.marketData[0].user
              );

              collection.stats = getPositionData();

              if (currentMarketId == collection.id) {
                setActiveInterestRate(collection.rate);
                setActiveMarketSupplied(collection.value);
                setActiveMarketAvailable(collection.available);
                setNftPrice(RoundHalfDown(Number(collection.nftPrice)));
                setFetchedDataObject(collection.marketData[0]);
                collection.userTotalDeposits
                  ? setUserTotalDeposits(collection.userTotalDeposits)
                  : setUserTotalDeposits(0);
              }
              return collection;
              // runs for all the markets in the array - root of data is server
            } else if (!activeMarket && marketData && marketData.length) {
              collection.marketData = marketData.filter(
                //@ts-ignore
                marketObject => marketObject.marketId === collection.id
              );

              await populateMarketData(
                'LEND',
                collection,
                currentMarketId,
                collection.marketData[0].positions,
                true,
                ROOT_SSR
              );
              collection.stats = getPositionData();

              if (currentMarketId == collection.id) {
                setActiveInterestRate(collection.rate);
                setActiveMarketSupplied(collection.value);
                setActiveMarketAvailable(collection.available);
                setNftPrice(RoundHalfDown(Number(collection.nftPrice)));
                setFetchedDataObject(collection.marketData[0]);
                collection.userTotalDeposits
                  ? setUserTotalDeposits(collection.userTotalDeposits)
                  : setUserTotalDeposits(0);
              }
              return collection;
            }
            return collection;
          })
        );
      }

      getData().then(result => {
        setTableData(result);
        setTableDataFiltered(result);
      });
    }
  }, [
    marketData,
    clientMarketData,
    userTotalDeposits,
    activeMarket,
    honeyReservesChange
  ]);

  const onSearch = (searchTerm: string): LendTableRow[] => {
    if (!searchTerm) {
      return [...tableData];
    }
    const r = new RegExp(searchTerm, 'mi');
    return [...tableData].filter(row => {
      return r.test(row.name);
    });
  };

  const handleRowClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    record: LendTableRow
  ) => {
    setCurrentMarketId(record.id);
    showMobileSidebar();
  };

  const debouncedSearch = useCallback(
    debounce(searchQuery => {
      setTableDataFiltered(onSearch(searchQuery));
    }, 500),
    [tableData]
  );

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [tableData]
  );

  // Apply search if initial lend list changed
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [tableData]);

  const handleToggle = (checked: boolean) => {
    setIsMyCollectionsFilterEnabled(checked);
  };

  const MyCollectionsToggle = () => null;
  // handle search form- filter collections
  const SearchForm = () => {
    return (
      <SearchInput
        onChange={handleSearchInputChange}
        placeholder="Search by name"
        value={searchQuery}
      />
    );
  };

  const columnsWidth: Array<number | string> = [240, 150, 150, 150, 150];
  // Render Desktop Data
  const columns: ColumnType<LendTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
        title: SearchForm,
        dataIndex: 'name',
        key: 'name',
        render: (name: string) => {
          return (
            <div className={style.nameCell}>
              <div className={style.logoWrapper}>
                <div className={style.collectionLogo}>
                  <HexaBoxContainer>
                    {renderMarketImageByName(name)}
                  </HexaBoxContainer>
                </div>
              </div>
              <div className={style.collectionName}>{name}</div>
            </div>
          );
        }
      },
      {
        width: columnsWidth[1],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'rate');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Interest rate</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'rate',
        sorter: (a: any = 0, b: any = 0) => a.rate - b.rate,
        render: (rate: number, market: any) => {
          return (
            <div className={c(style.rateCell, style.lendRate)}>{fp(rate)}</div>
          );
        }
      },
      {
        width: columnsWidth[3],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'value');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Supplied</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'value',
        sorter: (a, b) => a.value - b.value,
        render: (value: number, market: any) => {
          return <div className={style.valueCell}>{fs(value)}</div>;
        }
      },
      {
        width: columnsWidth[2],
        title: ({ sortColumns }) => {
          const sortOrder = getColumnSortStatus(sortColumns, 'available');
          return (
            <div
              className={
                style.headerCell[
                  sortOrder === 'disabled' ? 'disabled' : 'active'
                ]
              }
            >
              <span>Available</span>{' '}
              <div className={style.sortIcon[sortOrder]} />
            </div>
          );
        },
        dataIndex: 'available',
        sorter: (a, b) => a.available - b.available,
        render: (available: number, market: any) => {
          return <div className={style.availableCell}>{fs(available)}</div>;
        }
      },
      {
        width: columnsWidth[4],
        title: MyCollectionsToggle,
        render: (_: null, row: LendTableRow) => {
          return (
            <div className={style.buttonsCell}>
              <HoneyButton variant="text">
                Manage <div className={style.arrowRightIcon} />
              </HoneyButton>
            </div>
          );
        }
      }
    ],
    [
      tableData,
      isMyCollectionsFilterEnabled,
      searchQuery,
      tableDataFiltered,
      currentMarketId
    ]
  );
  // Render Mobile Data
  const columnsMobile: ColumnType<LendTableRow>[] = useMemo(
    () => [
      {
        width: columnsWidth[0],
        dataIndex: 'name',
        key: 'name',
        render: (name: string, row: LendTableRow) => {
          return (
            <>
              <HoneyTableNameCell
                leftSide={
                  <>
                    <div className={style.logoWrapper}>
                      <div className={style.collectionLogo}>
                        <HexaBoxContainer>
                          {renderMarketImageByName(name)}
                        </HexaBoxContainer>
                      </div>
                    </div>
                    <div className={style.nameCellMobile}>
                      <div className={style.collectionName}>{name}</div>
                    </div>
                  </>
                }
                rightSide={
                  <div className={style.buttonsCell}>
                    <HoneyButton variant="text">
                      Manage <div className={style.arrowRightIcon} />
                    </HoneyButton>
                  </div>
                }
              />

              <HoneyTableRow>
                <div className={c(style.rateCell, style.lendRate)}>
                  {fp(row.rate)}
                </div>
                <div className={style.valueCell}>{fs(row.value)}</div>
                <div className={style.availableCell}>{fs(row.available)}</div>
              </HoneyTableRow>
            </>
          );
        }
      }
    ],
    [isMyCollectionsFilterEnabled, tableData, searchQuery, currentMarketId]
  );

  const lendSidebar = () => (
    <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
      <LendSidebar
        collectionId="s"
        executeDeposit={executeDeposit}
        executeWithdraw={executeWithdraw}
        userTotalDeposits={userTotalDeposits}
        available={activeMarketAvailable}
        value={activeMarketSupplied}
        userWalletBalance={userWalletBalance}
        fetchedSolPrice={fetchedSolPrice}
        onCancel={hideMobileSidebar}
        marketImage={renderMarketImageByName(currentMarketName)}
        currentMarketId={currentMarketId}
        activeInterestRate={activeInterestRate}
      />
    </HoneySider>
  );

  return (
    <LayoutRedesign>
      <HoneyContent sidebar={lendSidebar()}>
        <div>
          <Typography.Title className={pageTitle}>Lend</Typography.Title>
          <Typography.Text className={pageDescription}>
            Earn yield by depositing crypto into NFT markets.{' '}
            <span>
              <a
                target="_blank"
                href="https://buy.moonpay.com"
                rel="noreferrer"
              >
                <HoneyButton style={{ display: 'inline' }} variant="text">
                  Need crypto?
                </HoneyButton>
              </a>
            </span>
          </Typography.Text>
        </div>
        <div className={style.hideTablet}>
          <HoneyTable
            hasRowsShadow={true}
            tableLayout="fixed"
            columns={columns}
            dataSource={tableDataFiltered}
            pagination={false}
            className={style.table}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => handleMarketId(record)
              };
            }}
            selectedRowsKeys={[
              tableDataFiltered.find(data => data.id === currentMarketId)
                ?.key || ''
            ]}

            // TODO: uncomment when the chart has been replaced and implemented
            // expandable={{
            //   // we use our own custom expand column
            //   showExpandColumn: false,
            //   onExpand: (expanded, row) =>
            //     setExpandedRowKeys(expanded ? [row.key] : []),
            //   expandedRowKeys,
            //   expandedRowRender: record => {
            //     return (
            //       <div className={style.expandSection}>
            //         <div className={style.dashedDivider} />
            //         <HoneyChart title="Interest rate" data={record.stats} />
            //       </div>
            //   );
            // }
            // }}
          />
        </div>
        <div className={style.showTablet}>
          <div
            className={c(
              style.mobileTableHeader,
              style.mobileSearchAndToggleContainer
            )}
          >
            <div className={style.mobileRow}>
              <SearchForm />
            </div>
            <div className={style.mobileRow}>
              <MyCollectionsToggle />
            </div>
          </div>
          <div className={c(style.mobileTableHeader)}>
            <div className={style.tableCell}>Interest</div>
            <div className={style.tableCell}>Supplied</div>
            <div className={style.tableCell}>Available</div>
          </div>
          <HoneyTable
            hasRowsShadow={true}
            tableLayout="fixed"
            columns={columnsMobile}
            dataSource={tableDataFiltered}
            pagination={false}
            showHeader={false}
            className={style.table}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => handleRowClick(event, record)
              };
            }}
          />
        </div>
      </HoneyContent>
    </LayoutRedesign>
  );
};

export default Lend;
