import { Contract, Provider, constants } from 'starknet';
import { Token, getTokens } from './tokens';
import { sqrtRatioToPrice, tickToSqrtRatio } from './price';
import { getPoolFee, getPoolTickSpacing } from './pool';
import { daysBetweenDates } from './date';
import { PositionEkubo, PositionHistory } from '../models/ekubo/api';
import { PositionUi } from '../models/ui/position-ui';
import { GetTokenInfoRequest, GetTokenInfoResult } from '../models/ekubo/smartcontract';
import { PositionDto } from '../models/dto/position.dto';

export const getPositionsExplore = async (): Promise<Array<PositionUi>> => {
	const positions: Array<PositionDto> = await fetch(`${process.env.REACT_APP_OCTOPUS_API_URL}position`).then((res) => res.json());
	const tokens = await getTokens();

	return positions.map((position) => map(position, tokens)) as Array<PositionUi>;
};

export const getPositionsUi = async (positions: Array<PositionEkubo>): Promise<Array<PositionUi>> => {
	if (!positions || positions.length === 0) return [];

	const tokens = await getTokens();
	const positionsInfosParams: Array<GetTokenInfoRequest> = [];
	const positionsHistory: Array<PositionHistory> = [];
	positions.forEach(async (position) => {
		positionsInfosParams.push({
			id: position.id,
			pool_key: position.pool_key,
			bounds: {
				lower: {
					mag: Math.abs(position.bounds.lower),
					sign: position.bounds.lower < 0,
				},
				upper: {
					mag: Math.abs(position.bounds.upper),
					sign: position.bounds.upper < 0,
				},
			},
		});
		positionsHistory.push(await getPositionHistory(position.id));
	});
	const positionsInfos = await getPositionsInfos(positionsInfosParams);

	const positionsUi = [];
	for (let i = 0; i < positions.length; i++) {
		positionsUi.push(await getPositionUi(positions[i], positionsInfos[i], positionsHistory[i], tokens));
	}
	return positionsUi;
};

export const getPositions = async (address: string): Promise<Array<PositionEkubo>> => {
	return (await fetch('https://mainnet-api.ekubo.org/positions/' + address).then((res) => res.json())).data;
};

const getPositionsInfos = async (params: Array<GetTokenInfoRequest>): Promise<Array<GetTokenInfoResult>> => {
	const provider = new Provider({
		sequencer: { network: constants.NetworkName.SN_MAIN },
	});
	const ekuboAddress = '0x02e0af29598b407c8716b17f6d2795eca1b471413fa03fb145a5e33722184067';
	const { abi: ekuboAbi } = await provider.getClassAt(ekuboAddress);
	if (ekuboAbi === undefined) {
		throw new Error('no abi.');
	}
	const ekuboContract = new Contract(ekuboAbi, ekuboAddress, provider);

	return ekuboContract.get_tokens_info(params).catch((error: any) => {});
};

const getPositionHistory = async (positionId: number): Promise<PositionHistory> => {
	return await fetch('https://mainnet-api.ekubo.org/' + positionId + '/history').then((res) => res.json());
};

const getPositionUi = async (position: PositionEkubo, positionInfos: GetTokenInfoResult, positionHistory: PositionHistory, tokens: Array<Token>): Promise<PositionUi> => {
	const token0 = tokens.find((token) => token.l2_token_address.slice(-10) === position.pool_key.token0.slice(-10)) as Token;
	const token1 = tokens.find((token) => token.l2_token_address.slice(-10) === position.pool_key.token1.slice(-10)) as Token;
	const currentPrice = sqrtRatioToPrice(Number(positionInfos.pool_price.sqrt_ratio));
	const minPrice = sqrtRatioToPrice(tickToSqrtRatio(position.bounds.lower));
	const maxPrice = sqrtRatioToPrice(tickToSqrtRatio(position.bounds.upper));
	const initialAmount0 = Number(positionHistory.events[0].delta0) / 10 ** token0.decimals;
	const initialAmount1 = Number(positionHistory.events[0].delta1) / 10 ** token1.decimals;
	const token0Price = Number(token0.price.price);
	const token1Price = Number(token1.price.price);
	const amount0 = Number(positionInfos.amount0) / 10 ** token0.decimals;
	const amount1 = Number(positionInfos.amount1) / 10 ** token1.decimals;
	const fees0 = Number(positionInfos.fees0) / 10 ** token0.decimals;
	const fees1 = Number(positionInfos.fees1) / 10 ** token1.decimals;
	const totalInitialAmount = initialAmount0 * token0Price + initialAmount1 * token1Price;
	const totalCurrentAmount = amount0 * token0Price + amount1 * token1Price;
	const totalFeesAmount = fees0 * token0Price + fees1 * token1Price;
	const durationPositionInDays = daysBetweenDates(new Date(positionHistory.events[0].timestamp), new Date());
	const totalPnl = totalCurrentAmount + totalFeesAmount - totalInitialAmount;
	return {
		id: position.id,
		owner: positionHistory.events[0].recipient,
		currentPrice: currentPrice,
		minPrice: minPrice,
		maxPrice: maxPrice,
		token0Symbol: token0.symbol,
		token1Symbol: token1.symbol,
		token0Price: token0Price,
		token1Price: token1Price,
		fee: getPoolFee(position.pool_key.fee),
		tickSpacing: getPoolTickSpacing(position.pool_key.tick_spacing),
		fees0: Number(positionInfos.fees0) / 10 ** token0.decimals,
		fees1: Number(positionInfos.fees1) / 10 ** token1.decimals,
		amount0: Number(positionInfos.amount0) / 10 ** token0.decimals,
		amount1: Number(positionInfos.amount1) / 10 ** token1.decimals,
		initialAmount0: initialAmount0,
		initialAmount1: initialAmount1,
		mintTimestamp: new Date(positionHistory.events[0].timestamp),
		inRange: Number(currentPrice) >= Number(minPrice) && Number(currentPrice) <= Number(maxPrice),
		totalInitialAmount: totalInitialAmount,
		totalCurrentAmount: totalCurrentAmount,
		totalFeesAmount: totalFeesAmount,
		totalPnl: totalPnl,
		totalApr: calculateSimpleAPR(totalPnl / totalInitialAmount, durationPositionInDays),
		durationPositionInDays: durationPositionInDays,
		feeApr: calculateSimpleAPR(totalFeesAmount / totalInitialAmount, durationPositionInDays),
	};
};

const map = (position: PositionDto, tokens: Array<Token>): PositionUi | null => {
	const token0 = tokens.find((token) => token.l2_token_address.slice(-10) === position.token0.slice(-10)) as Token;
	const token1 = tokens.find((token) => token.l2_token_address.slice(-10) === position.token1.slice(-10)) as Token;
	if (!token0.price || !token1.price) return null;
	const currentPrice = sqrtRatioToPrice(Number(position.positionInfo?.sqrtRatio));
	const minPrice = sqrtRatioToPrice(tickToSqrtRatio(Number(position.boundLowerMag)));
	const maxPrice = sqrtRatioToPrice(tickToSqrtRatio(Number(position.boundUpperMag)));
	const durationPositionInDays = daysBetweenDates(new Date(position.mintTimestamp * 1000), new Date());

	return {
		id: position.id,
		owner: position.owner,
		currentPrice: currentPrice,
		minPrice: minPrice,
		maxPrice: maxPrice,
		token0Symbol: token0.symbol,
		token1Symbol: token1.symbol,
		token0Price: Number(token0.price.price),
		token1Price: Number(token1.price.price),
		fee: getPoolFee(position.fee),
		tickSpacing: getPoolTickSpacing(position.tickSpacing),
		fees0: Number(position.positionInfo?.fees0) / 10 ** token0.decimals,
		fees1: Number(position.positionInfo?.fees1) / 10 ** token1.decimals,
		amount0: Number(position.positionInfo?.currentAmount0) / 10 ** token0.decimals,
		amount1: Number(position.positionInfo?.currentAmount1) / 10 ** token1.decimals,
		initialAmount0: Number(position.positionEvents[0].amount0) / 10 ** token0.decimals,
		initialAmount1: Number(position.positionEvents[0].amount1) / 10 ** token1.decimals,
		mintTimestamp: new Date(position.mintTimestamp * 1000),
		inRange: Number(currentPrice) >= Number(minPrice) && Number(currentPrice) <= Number(maxPrice),
		totalInitialAmount: position.positionInfo?.totalInitialAmountUsd as number,
		totalCurrentAmount: position.positionInfo?.totalCurrentAmountUsd as number,
		totalFeesAmount: position.positionInfo?.totalFeesAmountUsd as number,
		totalPnl: position.positionInfo?.totalPnlUsd as number,
		totalApr: position.positionInfo?.totalApr as number,
		durationPositionInDays: durationPositionInDays,
		feeApr: position.positionInfo?.feeApr as number,
	};
};

// Fonction pour calculer l'APR à partir du ROI (0.1 = 10%) et de T (en jours) pour un ROI simple
const calculateSimpleAPR = (ROI: number, T: number): number => {
	let T_in_years = T / 365;
	return (ROI / T_in_years) * 1;
};

// Fonction pour calculer l'APR à partir du ROI (0.1 = 10%) et de T (en jours) pour un ROI composé
const calculateCompoundAPR = (ROI: number, T: number): number => {
	let T_in_years = T / 365;
	return Math.pow(1 + ROI, 1 / T_in_years) - 1;
};
