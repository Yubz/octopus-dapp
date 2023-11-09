import Decimal from "decimal.js-light";

export const sqrtRatioToPrice = (sqrt_ratio: number): string => {
  return (sqrt_ratio ** 2 / 2 ** 256).toFixed(7);
};

export const tickToSqrtRatio = (tick: number): number => {
  Decimal.set({ precision: 78 });
  return new Decimal("1.000001")
    .sqrt()
    .pow(tick)
    .mul(new Decimal(2).pow(128))
    .toNumber();
};
