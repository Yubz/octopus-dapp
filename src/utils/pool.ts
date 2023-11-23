export const getPoolFee = (hexFee: string): number => {
	const bigIntValue = BigInt('170141183460469235273462165868118016');
	const decimalValue = 0.0005;
	const scale = Number(bigIntValue) / Number(decimalValue);

	return Number((Number(hexFee) / scale).toFixed(8));
};

export const getPoolTickSpacing = (hexTickSpacing: string): number => {
	console.log(Number(Number(Number(BigInt(hexTickSpacing)) / 1000000).toFixed(4)));
	return Number(Number(Number(BigInt(hexTickSpacing)) / 1000000).toFixed(4));
};
