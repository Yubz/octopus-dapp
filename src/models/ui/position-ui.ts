export interface PositionUi {
  id: number;
  owner: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Price: number;
  token1Price: number;
  fee: number;
  tickSpacing: number;
  minPrice: string;
  maxPrice: string;
  currentPrice: string;
  fees0: number;
  fees1: number;
  amount0: number;
  amount1: number;
  initialAmount0: number;
  initialAmount1: number;
  mintTimestamp: Date;
  inRange: boolean;
  totalInitialAmount: number;
  totalCurrentAmount: number;
  totalFeesAmount: number;
  totalPnl: number;
  durationPositionInDays: number;
  totalApr: number;
  feeApr: number;
}
