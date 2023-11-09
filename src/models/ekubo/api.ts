import { PoolKey } from "./smartcontract";

export interface Bounds {
  lower: number;
  upper: number;
}

export interface Position {
  bounds: Bounds;
  id: number;
  image: string;
  metadata_url: string;
  minted_timestamp: number;
  pool_key: PoolKey;
}

export interface TokenPrice {
  price: string;
  timestamp: Date;
}

export interface PositionHistory {
  events: Array<Event>;
}

export interface Event {
  collect_fees: string;
  delta0: string;
  delta1: string;
  liquidity_delta: string;
  recipient: string;
  timestamp: string;
  transaction_hash: string;
}
