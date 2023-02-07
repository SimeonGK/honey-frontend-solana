import { HoneyClient, HoneyMarket, HoneyReserve, HoneyUser } from "@honey-finance/sdk";
import { PublicKey } from "@solana/web3.js";

export type BorrowProps = {
  ssrMarketData: {
      honeyClient: HoneyClient
      market: HoneyMarket,
      reservers: HoneyReserve,
      honeyUser: HoneyUser,
      positions: [],
      bids: []
  }
};
