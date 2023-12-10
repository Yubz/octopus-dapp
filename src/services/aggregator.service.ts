import { executeSwap, fetchQuotes } from '@avnu/avnu-sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { parseUnits, formatUnits } from 'ethers';
import { Router as FibrousRouter, RouteSuccess } from 'fibrous-router-sdk';
import { AccountInterface, Call } from 'starknet';
import axios from 'axios';
import { Token } from './token.service';

export interface SwapRoute {
	outputAmount: number;
	outputAmountUsd: number;
	outputAmountWithGasUsd: number;
	gasFeesUsd: number;
	aggregator: 'Avnu' | 'Fibrous' | 'OpenOcean';
}

export const fetchAvnu = async (sellToken: Token, buyToken: Token, sellTokenAmount: number): Promise<SwapRoute> => {
	const params = {
		sellTokenAddress: sellToken.l2_token_address,
		buyTokenAddress: buyToken.l2_token_address,
		sellAmount: BigNumber.from(parseUnits(sellTokenAmount.toString(), sellToken.decimals)).toBigInt(),
	};
	const avnuQuotes = await fetchQuotes(params);
	const outputAmount = Number(formatUnits(avnuQuotes[0].buyAmount, buyToken.decimals));
	return {
		aggregator: 'Avnu',
		outputAmount: Number(formatUnits(avnuQuotes[0].buyAmount, buyToken.decimals)),
		outputAmountUsd: outputAmount * buyToken.price!,
		outputAmountWithGasUsd: avnuQuotes[0].buyAmountInUsd - avnuQuotes[0].gasFeesInUsd,
		gasFeesUsd: avnuQuotes[0].gasFeesInUsd,
	};
};

export const swapOnAvnu = async (sellToken: Token, buyToken: Token, sellTokenAmount: number, account: AccountInterface, slippage: number): Promise<string> => {
	const params = {
		sellTokenAddress: sellToken.l2_token_address,
		buyTokenAddress: buyToken.l2_token_address,
		sellAmount: BigNumber.from(parseUnits(sellTokenAmount.toString(), sellToken.decimals)).toBigInt(),
		takerAddress: account.address,
	};
	const avnuQuotes = await fetchQuotes(params);
	return (await executeSwap(account, avnuQuotes[0], { slippage: slippage / 100 })).transactionHash;
};

export const fetchFibrous = async (sellToken: Token, buyToken: Token, sellTokenAmount: number): Promise<SwapRoute> => {
	const inputAmount = BigNumber.from(parseUnits(sellTokenAmount.toString(), sellToken.decimals));
	const router = new FibrousRouter();
	const fibrousRoute = (await router.getBestRoute(inputAmount, sellToken.l2_token_address, buyToken.l2_token_address)) as RouteSuccess;

	const outputAmount = Number(formatUnits(fibrousRoute.outputAmount, buyToken.decimals));
	const outputAmountUsd = outputAmount * buyToken.price!;
	const gasFeesUsd = fibrousRoute.estimatedGasUsed ? Number(formatUnits(fibrousRoute.estimatedGasUsed, 18)) : 0;

	return {
		aggregator: 'Fibrous',
		outputAmount: outputAmount,
		outputAmountUsd: outputAmountUsd,
		outputAmountWithGasUsd: outputAmountUsd - gasFeesUsd,
		gasFeesUsd: gasFeesUsd,
	};
};

export const swapOnFibrous = async (sellToken: Token, buyToken: Token, sellTokenAmount: number, account: AccountInterface, slippage: number): Promise<string> => {
	const inputAmount = BigNumber.from(parseUnits(sellTokenAmount.toString(), sellToken.decimals));
	const router = new FibrousRouter();

	const approveCall: Call = await router.buildApprove(inputAmount, sellToken.l2_token_address);
	const swapCall: Call = await router.buildTransaction(inputAmount, sellToken.l2_token_address, buyToken.l2_token_address, slippage/100, account.address);

	return (await account.execute([approveCall, swapCall])).transaction_hash;
};

export const fetchOpenOcean = async (sellToken: Token, buyToken: Token, sellTokenAmount: number): Promise<SwapRoute> => {
	const inputAmount = BigNumber.from(parseUnits(sellTokenAmount.toString(), sellToken.decimals));

	const queryParams = new URLSearchParams({
		inTokenSymbol: sellToken.symbol,
		inTokenAddress: sellToken.l2_token_address,
		outTokenSymbol: buyToken.symbol,
		outTokenAddress: buyToken.l2_token_address,
		amount: inputAmount.toString(),
		gasPrice: '5000000000'
	});
	const quote = await axios.get(`https://ethapi.openocean.finance/v1/starknet/quote?${queryParams}`);
	const outputAmount = Number(formatUnits(quote.data.outAmount, buyToken.decimals));
	const outputAmountUsd = outputAmount * buyToken.price!;

	return {
		aggregator: 'OpenOcean',
		outputAmount: outputAmount,
		outputAmountUsd: outputAmountUsd,
		outputAmountWithGasUsd: outputAmountUsd,
		gasFeesUsd: 0,
	};
};
