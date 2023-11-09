export const getPoolFee = (hexFee: string): number => {
  const bigIntValue = BigInt("170141183460469235273462165868118016");
  const decimalValue = 0.0005;
  const scale = Number(bigIntValue) / Number(decimalValue);

  return Number((Number(hexFee) / scale).toFixed(8));
};

export const getPoolTickSpacing = (hexTickSpacing: string): number => {
  return Number(BigInt(hexTickSpacing)) / 1000000;
};
