import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, CardOverflow, Input, List, ListItemButton, Typography } from '@mui/joy';
import { KeyboardArrowDown, ImportExport, LocalGasStation } from '@mui/icons-material';
import ConnectWallet from '../../ui/connect-wallet/connect-wallet';
import { useAccount, useBalance } from '@starknet-react/core';
import TokensModal from '../../ui/tokens-modal/tokens-modal';
import { useDebounce } from 'use-debounce';
import { SwapRoute, fetchAvnu, fetchFibrous, fetchOpenOcean, swapOnAvnu, swapOnFibrous } from '../../services/aggregator.service';
import { Token, getTokenPrice } from '../../services/token.service';

export function Swap() {
	const { address, account } = useAccount();

	const [sellToken, setSellToken] = useState<Token>();
	const [sellTokenAmount, setSellTokenAmount] = useState<number>(0);
	const [debouncedSellTokenAmount] = useDebounce(sellTokenAmount, 500);
	const [sellTokenAmountUsd, setSellTokenAmountUsd] = useState<number>();
	const sellTokenWalletAmount = useBalance({
		address,
		token: sellToken?.l2_token_address,
		watch: true,
	}).data;

	const [buyToken, setBuyToken] = useState<Token>();
	const [buyTokenAmount, setBuyTokenAmount] = useState<number>(0);
	const [buyTokenAmountUsdAfterGas, setBuyTokenAmountUsdAfterGas] = useState<number>();
	const buyTokenWalletAmount = useBalance({
		address,
		token: buyToken?.l2_token_address,
		watch: true,
	}).data;

	const [openTokenModal, setOpenTokenModal] = useState<'buy' | 'sell'>();
	const [connectWalletOpened, setConnectWalletOpened] = useState<boolean>(false);

	const [swapRoutes, setSwapRoutes] = useState<Array<SwapRoute>>([]);
	const [aggregator, setAggregator] = useState<'Fibrous' | 'Avnu' | 'OpenOcean'>();
	const [swapLoading, setSwapLoading] = useState<boolean>(false);

	useEffect(() => {
		fetchAggrQuotes();
		fetchPrice();
		// eslint-disable-next-line
	}, [address, debouncedSellTokenAmount, sellToken, buyToken]);

	useEffect(() => {
		if (address) {
			setConnectWalletOpened(false);
		}
	}, [address]);

	const closeConnectWalletModal = useCallback(() => {
		setConnectWalletOpened(false);
	}, []);

	const closeTokensModal = useCallback(
		(token?: Token) => {
			if (token) {
				if (openTokenModal === 'buy') {
					setBuyToken(token);
					if (token === sellToken) {
						setSellToken(undefined);
					}
				} else {
					setSellToken(token);
					if (token === buyToken) {
						setBuyToken(undefined);
					}
				}
			}
			setOpenTokenModal(undefined);
		},
		[openTokenModal, buyToken, sellToken],
	);

	async function fetchAggrQuotes() {
		setBuyTokenAmount(0);
		setBuyTokenAmountUsdAfterGas(0);
		setSwapRoutes([]);
		if (sellToken && sellTokenAmount > 0 && buyToken) {
			// Create a promise that rejects in 5000 milliseconds
			let timeout = new Promise<SwapRoute | undefined>((resolve, reject) => {
				let id = setTimeout(() => {
					clearTimeout(id);
					resolve(undefined);
				}, 2000);
			});
			Promise.all([
				fetchAvnu(sellToken, buyToken, sellTokenAmount),
				fetchFibrous(sellToken, buyToken, sellTokenAmount),
				Promise.race([fetchOpenOcean(sellToken, buyToken, sellTokenAmount), timeout]),
			]).then((swapRoutes) => {
				const routes = swapRoutes.filter((swapRoute) => swapRoute != null) as Array<SwapRoute>;
				routes.sort((a: SwapRoute, b: SwapRoute) => (a.gasFeesUsd === 0 ? 1 : b.outputAmountWithGasUsd - a.outputAmountWithGasUsd));
				setSwapRoutes(routes);
				selectSwapRoute(routes[0]);
			});
		}
	}

	async function fetchPrice() {
		if (sellTokenAmount === 0) {
			setSellTokenAmountUsd(undefined);
		} else if (sellToken) {
			const price = await getTokenPrice(sellToken);
			setSellTokenAmountUsd(sellTokenAmount * price);
		}
	}

	async function selectSwapRoute(swapRoute: SwapRoute) {
		if (buyToken) {
			const price = await getTokenPrice(buyToken);
			setBuyTokenAmount(swapRoute.outputAmount);
			setBuyTokenAmountUsdAfterGas(swapRoute.outputAmount * price);
			setAggregator(swapRoute.aggregator);
		}
	}

	function pourcentageDifference(value: number, compareWith: number) {
		return (100 * Math.abs(value - compareWith)) / ((value + compareWith) / 2);
	}

	function switchToken() {
		const tokenBuy = buyToken;
		const tokenSell = sellToken;
		setBuyToken(tokenSell);
		setSellToken(tokenBuy);
	}

	async function doSwap() {
		if (account && aggregator && sellToken && buyToken && address) {
			setSwapLoading(true);
			try {
				if (aggregator === 'Avnu') {
					await swapOnAvnu(sellToken, buyToken, sellTokenAmount, account);
				} else {
					await swapOnFibrous(sellToken, buyToken, sellTokenAmount, account);
				}
			} catch (error) {
				console.log(error);
			}
			setSwapLoading(false);
		}
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
								sx={{
									minWidth: '160px',
									padding: '12px',
									marginLeft: 'auto',
									background: 'rgba(0, 0, 0, 0.4)',
									color: 'rgba(255, 255, 255, 1)',
									'&:hover': {
										background: 'rgba(0, 0, 0, 0.4)',
										color: 'rgba(255, 255, 255, 1)',
									},
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
										≈{' '}
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
								{sellToken && sellTokenWalletAmount && (
									<>Balance: {Number(Number(sellTokenWalletAmount?.formatted).toFixed(4)) === 0 ? '0' : Number(sellTokenWalletAmount?.formatted).toFixed(4)}</>
								)}
							</Typography>
						</div>
					</div>
					<Button
						style={{ position: 'absolute', display: 'inline-flex', margin: 'auto', inset: '0px', width: '2.25rem', height: '2.25rem' }}
						onClick={() => switchToken()}
					>
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
								sx={{
									minWidth: '160px',
									padding: '12px',
									marginLeft: 'auto',
									background: 'rgba(0, 0, 0, 0.4)',
									color: 'rgba(255, 255, 255, 1)',
									'&:hover': {
										background: 'rgba(0, 0, 0, 0.4)',
										color: 'rgba(255, 255, 255, 1)',
									},
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
								{buyToken && buyTokenWalletAmount && (
									<>Balance: {Number(Number(buyTokenWalletAmount?.formatted).toFixed(4)) === 0 ? '0' : Number(buyTokenWalletAmount?.formatted).toFixed(4)}</>
								)}
							</Typography>
						</div>
					</div>
				</CardContent>
				<CardOverflow>
					<CardActions buttonFlex="1" sx={{ padding: 0 }}>
						{!address && (
							<Button sx={{ minHeight: '40px' }} onClick={() => setConnectWalletOpened(true)}>
								Connect Wallet
							</Button>
						)}
						{address &&
							aggregator &&
							swapRoutes.length > 0 &&
							(Number(sellTokenWalletAmount?.formatted) > sellTokenAmount ? (
								<Button sx={{ minHeight: '40px' }} onClick={() => doSwap()} loading={swapLoading}>
									{!swapLoading && `via ${aggregator}`}
								</Button>
							) : (
								<Button sx={{ minHeight: '40px' }} disabled>
									Insufficiant Balance
								</Button>
							))}
						{address && (!aggregator || swapRoutes.length === 0) && (
							<Button sx={{ minHeight: '40px' }} disabled>
								Select aggregator
							</Button>
						)}
					</CardActions>
				</CardOverflow>
			</Card>
			<Card className="routes-card" variant="soft">
				<CardContent orientation="vertical" sx={{ gap: '10px' }}>
					<List sx={{ gap: '10px', '--ListDivider-gap': 0 }}>
						{swapRoutes.map((swapRoute, index) => (
							<ListItemButton
								className={aggregator === swapRoute.aggregator ? 'aggregator-route selected' : 'aggregator-route'}
								sx={{ borderRadius: '8px', minHeight: '58px' }}
								onClick={() => selectSwapRoute(swapRoute)}
								key={swapRoute.aggregator}
							>
								<img alt="logo" src={`/images/aggregator/${swapRoute.aggregator.toLocaleLowerCase()}.svg`} width="80"></img>
								<div className="output-amount">
									<Typography fontWeight="lg" fontSize="lg">
										{swapRoute.outputAmount.toFixed(4)} {buyToken?.symbol}
									</Typography>
									{swapRoute.gasFeesUsd > 0 ? (
										<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
											≈{' '}
											{new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(swapRoute.outputAmountWithGasUsd)}{' '}
											after fees
										</Typography>
									) : (
										<Typography fontWeight="sm" fontSize="sm" fontStyle="italic" color="danger">
											≈{' '}
											{new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(swapRoute.outputAmountWithGasUsd)}{' '}
											before fees
										</Typography>
									)}
								</div>
								<div className="extra-infos">
									{swapRoute.gasFeesUsd ? (
										index === 0 ? (
											<Typography fontWeight="lg" fontSize="sm" color="success">
												BEST
											</Typography>
										) : (
											<Typography fontWeight="lg" fontSize="sm" color="danger">
												-{pourcentageDifference(swapRoute.outputAmountWithGasUsd, swapRoutes[0].outputAmountWithGasUsd).toFixed(2)}%
											</Typography>
										)
									) : (
										<Typography fontWeight="lg" fontSize="sm" color="danger"></Typography>
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
			<ConnectWallet opened={connectWalletOpened} onClose={closeConnectWalletModal}></ConnectWallet>
			<TokensModal
				opened={openTokenModal === 'buy' || openTokenModal === 'sell'}
				selectedToken={openTokenModal === 'buy' ? buyToken : sellToken}
				onClose={closeTokensModal}
			></TokensModal>
		</div>
	);
}

export default Swap;