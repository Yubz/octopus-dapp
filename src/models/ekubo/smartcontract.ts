export interface PoolKey {
  extension: string;
  fee: string;
  tick_spacing: string;
  token0: string;
  token1: string;
}

export interface PositionKey {
  salt: number;
  owner: string;
  bounds: Bounds;
}

export interface Bounds {
  lower: i129;
  upper: i129;
}

export interface i129 {
  mag: number;
  sign: boolean;
}

export interface FeesPerLiquidity {
  value0: BigInt;
  value1: BigInt;
}

export interface Position {
  liquidity: number;
  fees_per_liquidity_inside_last: FeesPerLiquidity;
}

export interface GetPositionWithFeesResult {
  position: Position;
  fees0: number;
  fees1: number;
  fees_per_liquidity_inside_current: FeesPerLiquidity;
}

export interface PoolPrice {
  sqrt_ratio: number;
  tick: Tick;
  call_points: CallPoints;
}

export interface Tick {
  mag: number;
  sign: boolean;
}

export interface CallPoints {
  after_initialize_pool: boolean;
  before_swap: boolean;
  after_swap: boolean;
  before_update_position: boolean;
  after_update_position: boolean;
}

export interface GetTokenInfoRequest {
  id: number;
  pool_key: PoolKey;
  bounds: Bounds;
}

export interface GetTokenInfoResult {
  pool_price: PoolPrice;
  liquidity: BigInt;
  amount0: BigInt;
  amount1: BigInt;
  fees0: BigInt;
  fees1: BigInt;
}
