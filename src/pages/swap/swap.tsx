import { useEffect, useState } from 'react';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardOverflow,
	Input,
	List,
	ListItemButton,
	ListItemDecorator,
	Modal,
	ModalClose,
	Option,
	Select,
	Sheet,
	Typography,
} from '@mui/joy';
import { fetchQuotes } from '@avnu/avnu-sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { Router as FibrousRouter, RouteSuccess } from 'fibrous-router-sdk';
import { parseUnits, formatUnits } from 'ethers';
import { KeyboardArrowDown, ImportExport, LocalGasStation } from '@mui/icons-material';

interface Token {
	decimals: number;
	l2_token_address: string;
	name: string;
	sort_order: number;
	symbol: string;
	hidden: boolean;
}

interface SwapRoute {
	outputAmount: number;
	outputAmountUsd: number;
	outputAmountWithGasUsd: number;
	gasFeesUsd: number;
	aggregator: 'Avnu' | 'Fibrous';
}

export function Swap() {
	const [sellToken, setSellToken] = useState<Token>();
	const [sellTokenAmount, setSellTokenAmount] = useState<number>(0);
	const [sellTokenAmountUsd, setSellTokenAmountUsd] = useState<number>();
	const [sellTokenWalletAmount, setSellTokenWalletAmount] = useState<number>();

	const [buyToken, setBuyToken] = useState<Token>();
	const [buyTokenAmount, setBuyTokenAmount] = useState<number>(0);
	const [buyTokenAmountUsdAfterGas, setBuyTokenAmountUsdAfterGas] = useState<number>();
	const [buyTokenWalletAmount, setBuyTokenWalletAmount] = useState<number>();

	const [tokens, setTokens] = useState<Array<Token>>([]);
	const [openTokenModal, setOpenTokenModal] = useState<'buy' | 'sell'>();

	const [swapRoutes, setSwapRoutes] = useState<Array<SwapRoute>>([]);
	const [aggregator, setAggregator] = useState<'Fibrous' | 'Avnu'>();

	useEffect(() => {
		const timeOutId = setTimeout(() => fetchAggrQuotes(), 500);
		return () => clearTimeout(timeOutId);
	}, [sellTokenAmount, sellToken, buyToken]);

	useEffect(() => {
		fetchTokens();
	}, []);

	async function fetchTokens() {
		const tokens: Array<Token> = await fetch('https://mainnet-api.ekubo.org/tokens').then((res) => res.json());
		setTokens(tokens.filter((token) => !token.hidden).sort((token) => token.sort_order));
	}

	async function fetchAggrQuotes() {
		if (sellTokenAmount === 0) {
			setBuyTokenAmount(0);
			setBuyTokenAmountUsdAfterGas(0);
			setSellTokenAmountUsd(undefined);
			setSwapRoutes([]);
		} else if (sellToken && sellTokenAmount && buyToken) {
			const params = {
				sellTokenAddress: sellToken.l2_token_address,
				buyTokenAddress: buyToken.l2_token_address,
				sellAmount: BigNumber.from(parseUnits(sellTokenAmount.toString(), sellToken.decimals)).toBigInt(),
				//takerAddress: '',
			};
			const avnuQuotes = await fetchQuotes(params);
			//setBuyTokenAmount(Number(formatUnits(quotes[0].buyAmount, buyToken.decimals)));
			//setSellTokenAmountUsd(quotes[0].sellAmountInUsd);

			//await executeSwap(account, quotes[0]);

			const inputAmount = BigNumber.from(parseUnits(sellTokenAmount.toString(), sellToken.decimals)); // for 1 Ether
			const router = new FibrousRouter();
			const fibrousRoute = (await router.getBestRoute(
				inputAmount, // amount
				sellToken.l2_token_address, // token input
				buyToken.l2_token_address, // token output
			)) as RouteSuccess;

			const swapRoutes = [];
			swapRoutes.push({
				aggregator: 'Avnu',
				outputAmount: Number(formatUnits(avnuQuotes[0].buyAmount, buyToken.decimals)),
				outputAmountUsd: avnuQuotes[0].buyAmountInUsd,
				outputAmountWithGasUsd: avnuQuotes[0].buyAmountInUsd - avnuQuotes[0].gasFeesInUsd,
				gasFeesUsd: avnuQuotes[0].gasFeesInUsd,
			} as SwapRoute);
			const outputAmount = Number(formatUnits(fibrousRoute.outputAmount, buyToken.decimals));
			const outputAmountUsd = outputAmount * fibrousRoute.outputToken.price;
			const gasFeesUsd = fibrousRoute.estimatedGasUsed ? Number(formatUnits(fibrousRoute.estimatedGasUsed, buyToken.decimals)) : 0;
			swapRoutes.push({
				aggregator: 'Fibrous',
				outputAmount: outputAmount,
				outputAmountUsd: outputAmountUsd,
				outputAmountWithGasUsd: outputAmountUsd - gasFeesUsd,
				gasFeesUsd: gasFeesUsd,
			} as SwapRoute);
			swapRoutes.sort((a, b) => b.outputAmount - a.outputAmount);
			setSwapRoutes(swapRoutes);
			selectSwapRoute(swapRoutes[0]);
		}
	}

	function selectToken(token: Token) {
		if (openTokenModal === 'buy') {
			setBuyToken(token);
		} else {
			setSellToken(token);
		}
		setOpenTokenModal(undefined);
	}

	function selectSwapRoute(swapRoute: SwapRoute) {
		setBuyTokenAmount(swapRoute.outputAmount);
		setBuyTokenAmountUsdAfterGas(swapRoute.outputAmountUsd);
		setAggregator(swapRoute.aggregator);
	}

	function pourcentageDifference(value: number, compareWith: number) {
		return (100 * Math.abs(value - compareWith)) / ((value + compareWith) / 2);
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
			<Card className="quote-card" variant="soft">
				<CardContent orientation="vertical" sx={{ position: 'relative', gap: '10px' }}>
					<div className="sell-token-bloc">
						<Typography fontWeight="sm" fontSize="sm" lineHeight="28px" sx={{ marginBottom: '10px' }}>
							Selling
						</Typography>
						<div className="input">
							<Input
								placeholder="0"
								type="number"
								variant="soft"
								sx={{ '--Input-focusedThickness': 0, lineHeight: '55px', boxShadow: 'none', fontSize: '36px' }}
								onChange={(event) => setSellTokenAmount(Number(event.target.value))}
							/>
							<Button
								variant="soft"
								color="primary"
								sx={{
									minWidth: '160px',
									padding: '12px',
									marginLeft: 'auto',
								}}
								onClick={() => setOpenTokenModal('sell')}
							>
								{sellToken ? (
									<div className="select-token-button">
										<img
											className="token-logo"
											height="30"
											width="30"
											alt="Token logo"
											src={'https://mainnet-api.ekubo.org/tokens/' + sellToken.l2_token_address + '/logo.svg'}
										/>
										<Typography fontWeight="lg" fontSize="lg" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', marginRight: '10px' }}>
											{sellToken.symbol}
										</Typography>
									</div>
								) : (
									<></>
								)}
								<KeyboardArrowDown sx={{ marginLeft: 'auto' }} />
							</Button>
						</div>
						<div className="infos">
							<Typography fontWeight="sm" fontSize="sm" lineHeight="28px" minHeight="28px">
								{sellTokenAmountUsd ? (
									<>
										≈
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
										}).format(Number(sellTokenAmountUsd))}
									</>
								) : (
									<></>
								)}
							</Typography>
							<Typography fontWeight="sm" fontSize="sm" lineHeight="28px" sx={{ marginLeft: 'auto' }} minHeight="28px">
								{sellTokenWalletAmount && <>Balance: {sellTokenWalletAmount}</>}
							</Typography>
						</div>
					</div>
					<Button style={{ position: 'absolute', display: 'inline-flex', margin: 'auto', inset: '0px', width: '2.25rem', height: '2.25rem' }}>
						<ImportExport></ImportExport>
					</Button>
					<div className="buy-token-bloc">
						<Typography fontWeight="sm" fontSize="sm" lineHeight="28px" sx={{ marginBottom: '10px' }}>
							Buying
						</Typography>
						<div className="input">
							<Input placeholder="0" type="number" variant="soft" disabled value={buyTokenAmount} sx={{ lineHeight: '55px', boxShadow: 'none', fontSize: '36px' }} />
							<Button
								variant="soft"
								color="primary"
								sx={{
									minWidth: '160px',
									padding: '12px',
									marginLeft: 'auto',
								}}
								onClick={() => setOpenTokenModal('buy')}
							>
								{buyToken ? (
									<div className="select-token-button">
										<img
											className="token-logo"
											height="30"
											width="30"
											alt="Token logo"
											src={'https://mainnet-api.ekubo.org/tokens/' + buyToken.l2_token_address + '/logo.svg'}
										/>
										<Typography fontWeight="lg" fontSize="lg" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', marginRight: '10px' }}>
											{buyToken.symbol}
										</Typography>
									</div>
								) : (
									<></>
								)}
								<KeyboardArrowDown sx={{ marginLeft: 'auto' }} />
							</Button>
						</div>
						<div className="infos">
							<Typography fontWeight="sm" fontSize="sm" lineHeight="28px" minHeight="28px">
								{buyTokenAmountUsdAfterGas ? (
									<>
										≈{' '}
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
										}).format(Number(buyTokenAmountUsdAfterGas))}
									</>
								) : (
									<></>
								)}
							</Typography>
							<Typography fontWeight="sm" fontSize="sm" lineHeight="28px" sx={{ marginLeft: 'auto' }} minHeight="28px">
								{buyTokenWalletAmount && <>Balance: {buyTokenWalletAmount}</>}
							</Typography>
						</div>
					</div>
				</CardContent>
				<CardOverflow>
					<CardActions buttonFlex="1">
						<Button sx={{ minHeight: '40px' }}>Connect Wallet</Button>
					</CardActions>
				</CardOverflow>
			</Card>
			<Modal
				className="token-modal"
				open={openTokenModal === 'buy' || openTokenModal === 'sell'}
				onClose={() => setOpenTokenModal(undefined)}
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
			>
				<Sheet
					variant="soft"
					sx={{
						width: '500px',
						height: '40vh',
						borderRadius: 'md',
						p: 3,
						boxShadow: 'lg',
					}}
				>
					<ModalClose variant="soft" sx={{ m: 1 }} />
					<Typography fontWeight="lg" fontSize="lg" id="modal-title">
						Select a token
					</Typography>
					<List sx={{ maxHeight: 'calc(100% - 2rem)', overflowY: 'scroll', '--ListDivider-gap': 0 }}>
						{tokens.map((token) => (
							<ListItemButton variant="soft" sx={{ borderRadius: '8px', marginRight: '10px' }} onClick={() => selectToken(token)}>
								<ListItemDecorator>
									<img height="35" width="35" src={'https://mainnet-api.ekubo.org/tokens/' + token.l2_token_address + '/logo.svg'} />
									<div className="token-info">
										<Typography fontWeight="lg" fontSize="lg">
											{token.symbol}
										</Typography>
										<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
											{token.name}
										</Typography>
									</div>
								</ListItemDecorator>
								<Typography fontWeight="sm" fontSize="sm" lineHeight="28px" sx={{ marginLeft: 'auto' }} minHeight="28px">
									10
								</Typography>
							</ListItemButton>
						))}
					</List>
				</Sheet>
			</Modal>
			<Card className="routes-card" variant="soft">
				<CardContent orientation="vertical" sx={{ gap: '10px' }}>
					<Typography fontWeight="lg" fontSize="lg" lineHeight="28px" sx={{ marginBottom: '10px' }}>
						Select a route to perform a swap
					</Typography>
					<List sx={{ gap: '10px' }}>
						{swapRoutes.map((swapRoute, index) => (
							<ListItemButton
								className={aggregator === swapRoute.aggregator ? 'aggregator-route selected' : 'aggregator-route'}
								sx={{ borderRadius: '8px', marginRight: '10px' }}
								onClick={() => selectSwapRoute(swapRoute)}
							>
								{swapRoute.aggregator === 'Avnu' ? (
									<img alt="logo" src="/images/aggregator/avnu.svg" width="80"></img>
								) : (
									<img alt="logo" src="/images/aggregator/fibrous.svg" width="80"></img>
								)}
								<div className="output-amount">
									<Typography fontWeight="lg" fontSize="lg">
										{swapRoute.outputAmount.toFixed(4)} {buyToken?.symbol}
									</Typography>
									<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
										≈{' '}
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
										}).format(swapRoute.outputAmountWithGasUsd)}
									</Typography>
								</div>
								<div className="extra-infos">
									{index === 0 ? (
										<Typography fontWeight="lg" fontSize="sm" color="success">
											BEST
										</Typography>
									) : (
										<Typography fontWeight="lg" fontSize="sm" color="danger">
											-{pourcentageDifference(swapRoute.outputAmountWithGasUsd, swapRoutes[0].outputAmountWithGasUsd).toFixed(2)}%
										</Typography>
									)}
									<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
										<LocalGasStation sx={{ width: '20px', height: '20px', marginRight: '2px', verticalAlign: 'sub' }}></LocalGasStation>
										{swapRoute.gasFeesUsd > 0
											? new Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
											  }).format(Number(swapRoute.gasFeesUsd.toFixed(4)))
											: 'Unknown'}{' '}
									</Typography>
								</div>
							</ListItemButton>
						))}
					</List>
				</CardContent>
			</Card>
		</div>
	);
}

export default Swap;
