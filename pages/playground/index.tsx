import { fetchAllMarkets, MarketBundle } from '@honey-finance/sdk';
import { ConfigureSDK } from 'helpers/loanHelpers';
import { marketCollections } from 'helpers/marketHelpers';
import React, { useEffect, useState } from 'react';

const Playground = () => {
  const [marketData, setMarketData] = useState<MarketBundle[]>([]);
  const sdkConfig = ConfigureSDK();

  async function fetchAllMarketData(marketIDs: string[]) {
    const data = await fetchAllMarkets(
      sdkConfig.saberHqConnection,
      sdkConfig.sdkWallet,
      sdkConfig.honeyId,
      marketIDs,
      false
    );

    setMarketData(data as unknown as MarketBundle[]);

    console.log(data[0].reserves[0].gatherReserveState());

    console.log(data);
  }

  useEffect(() => {
    if (
      sdkConfig.saberHqConnection &&
      sdkConfig.sdkWallet &&
      sdkConfig.honeyId
    ) {
      const marketIDs = marketCollections.map(market => market.id);
      fetchAllMarketData(marketIDs);
    }
  }, [sdkConfig.saberHqConnection, sdkConfig.sdkWallet]);

  return <div>Playground</div>;
};

export default Playground;
