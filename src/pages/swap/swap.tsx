import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardContent, CardOverflow, Input, Link, List, ListItemButton, Radio, RadioGroup, Sheet, Snackbar, Typography } from '@mui/joy';
import { KeyboardArrowDown, ImportExport, LocalGasStation, Verified, Error } from '@mui/icons-material';
import ConnectWallet from '../../ui/connect-wallet/connect-wallet';
import { useAccount, useBalance } from '@starknet-react/core';
import TokensModal from '../../ui/tokens-modal/tokens-modal';
import { useDebounce } from 'use-debounce';
import { SwapRoute, fetchAvnu, fetchFibrous, swapOnAvnu, swapOnFibrous } from '../../services/aggregator.service';
import { Token, fetchTokensPrice } from '../../services/token.service';

export function Swap() {
	const { address, account } = useAccount();

	const [sellToken, setSellToken] = useState<Token>();
	const [sellTokenAmount, setSellTokenAmount] = useState<number>(1);
	const [debouncedSellTokenAmount] = useDebounce(sellTokenAmount, 500);
	const [sellTokenAmountUsd, setSellTokenAmountUsd] = useState<number>();
	const sellTokenWalletAmount = useBalance({
		address,
		token: sellToken?.l2_token_address,
		watch: true,
		refetchInterval: 10000,
	}).data;

	const [buyToken, setBuyToken] = useState<Token>();
	const [buyTokenAmount, setBuyTokenAmount] = useState<number>(0);
	const [buyTokenAmountUsd, setBuyTokenAmountUsd] = useState<number>();
	const buyTokenWalletAmount = useBalance({
		address,
		token: buyToken?.l2_token_address,
		watch: true,
		refetchInterval: 10000,
	}).data;

	const [openTokenModal, setOpenTokenModal] = useState<'buy' | 'sell'>();
	const [connectWalletOpened, setConnectWalletOpened] = useState<boolean>(false);
	const [snackbar, setSnackbar] = useState<'success' | 'error'>();

	const [swapRoutes, setSwapRoutes] = useState<Array<SwapRoute>>([]);
	const [aggregator, setAggregator] = useState<'Fibrous' | 'Avnu' | 'OpenOcean'>();
	const [slippage, setSlippage] = useState<number>(0.1);
	const [swapLoading, setSwapLoading] = useState<boolean>(false);
	const [quoteLoading, setQuoteLoading] = useState<boolean>(false);

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

	useEffect(() => {
		fetchTokensPrice();
		const interval = setInterval(() => {
			fetchTokensPrice();
		}, 30000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	const closeConnectWalletModal = useCallback(() => {
		setConnectWalletOpened(false);
	}, []);

	const closeTokensModal = useCallback(
		(token?: Token) => {
			if (token) {
				if (openTokenModal === 'buy') {
					setBuyToken(token);
					if (token.l2_token_address === sellToken?.l2_token_address) {
						setSellToken(undefined);
					}
				} else {
					setSellToken(token);
					if (token.l2_token_address === buyToken?.l2_token_address) {
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
		setBuyTokenAmountUsd(0);
		setSwapRoutes([]);
		if (sellToken && sellTokenAmount > 0 && buyToken) {
			/*
				// Create a promise that resolve in 10 seconds
				let timeout = new Promise<SwapRoute | undefined>((resolve, reject) => {
					let id = setTimeout(() => {
						clearTimeout(id);
						resolve(undefined);
					}, 10000);
				});
			*/
			setQuoteLoading(true);
			Promise.all([
				fetchAvnu(sellToken, buyToken, sellTokenAmount).catch(() => null),
				fetchFibrous(sellToken, buyToken, sellTokenAmount).catch(() => null),
				//Promise.race([fetchOpenOcean(sellToken, buyToken, sellTokenAmount), timeout]),
			]).then((swapRoutes) => {
				const routes = swapRoutes.filter((swapRoute) => swapRoute != null && swapRoute.outputAmount > 0) as Array<SwapRoute>;
				routes.sort((a: SwapRoute, b: SwapRoute) => (a.gasFeesUsd === 0 ? 1 : b.outputAmountWithGasUsd - a.outputAmountWithGasUsd));
				setSwapRoutes(routes);
				if (routes.length > 0) {
					selectSwapRoute(routes[0]);
				}
				setQuoteLoading(false);
			});
		}
	}

	async function fetchPrice() {
		if (sellTokenAmount === 0) {
			setSellTokenAmountUsd(undefined);
		} else if (sellToken) {
			setSellTokenAmountUsd(sellTokenAmount * sellToken.price!);
		}
	}

	async function selectSwapRoute(swapRoute: SwapRoute) {
		if (buyToken) {
			setBuyTokenAmount(swapRoute.outputAmount);
			setBuyTokenAmountUsd(swapRoute.outputAmount * buyToken.price!);
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

	function handleSlippageChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSlippage(Number(event.target.value));
	}

	async function doSwap() {
		if (account && aggregator && sellToken && buyToken && address) {
			try {
				setSwapLoading(true);
				let txHash = '';
				if (aggregator === 'Avnu') {
					txHash = await swapOnAvnu(sellToken, buyToken, sellTokenAmount, account, slippage);
				} else if (aggregator === 'Fibrous') {
					txHash = await swapOnFibrous(sellToken, buyToken, sellTokenAmount, account, slippage);
				} else {
					//await swapOnOpenOcean(sellToken, buyToken, sellTokenAmount, account, slippage);
				}
				const txReceipt = await account.waitForTransaction(txHash);
				if (txReceipt.status === 'RECEIVED' || txReceipt.status === 'ACCEPTED_ON_L2') {
					setSnackbar('success');
				} else {
					setSnackbar('error');
				}
				setSwapLoading(false);
			} catch (error) {
				setSwapLoading(false);
			}
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
								value={sellTokenAmount}
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
										<img className="token-logo" height="30" width="30" alt="Token logo" src={sellToken.logo} />
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
									<>
										Balance: {Number(Number(sellTokenWalletAmount?.formatted).toFixed(4)) === 0 ? '0' : Number(sellTokenWalletAmount?.formatted).toFixed(4)}{' '}
										<Link onClick={() => setSellTokenAmount(Number(sellTokenWalletAmount?.formatted))}>MAX</Link>
									</>
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
										<img className="token-logo" height="30" width="30" alt="Token logo" src={buyToken.logo} />
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
								{buyTokenAmountUsd ? (
									<>
										≈{' '}
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
										}).format(buyTokenAmountUsd)}{' '}
										{sellTokenAmountUsd ? (
											<Typography
												fontWeight="sm"
												fontSize="sm"
												lineHeight="28px"
												minHeight="28px"
												color={buyTokenAmountUsd >= sellTokenAmountUsd! ? 'success' : 'danger'}
											>
												({buyTokenAmountUsd >= sellTokenAmountUsd! ? '+' : '-'}
												{pourcentageDifference(buyTokenAmountUsd, sellTokenAmountUsd!).toFixed(2)}%)
											</Typography>
										) : (
											''
										)}
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
				<CardOverflow sx={{ gap: '10px' }}>
					<div className="slippage-bloc">
						<Typography fontWeight="sm" fontSize="sm" lineHeight="28px" sx={{ marginBottom: '10px' }}>
							Max slippage
						</Typography>
						<RadioGroup
							aria-labelledby="slippage-attribute"
							defaultValue={0.1}
							sx={{ gap: 2, mb: 2, flexWrap: 'wrap', flexDirection: 'row' }}
							onChange={handleSlippageChange}
						>
							{[0.1, 0.5, 1, 2, 5, 10, 20].map((size) => (
								<Sheet
									key={size}
									sx={{
										position: 'relative',
										width: 40,
										height: 40,
										borderRadius: '8px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										paddingLeft: '0.5rem',
										paddingRight: '0.5rem',
										backgroundColor: 'transparent',
									}}
								>
									<Radio variant="soft" color="primary" overlay disableIcon value={size} label={size + '%'} />
								</Sheet>
							))}
						</RadioGroup>
					</div>
					<div className="actions-bloc">
						{!address && (
							<Button sx={{ minHeight: '40px', width: '100%' }} onClick={() => setConnectWalletOpened(true)}>
								Connect Wallet
							</Button>
						)}
						{address &&
							aggregator &&
							swapRoutes.length > 0 &&
							(Number(sellTokenWalletAmount?.formatted) >= sellTokenAmount ? (
								<Button sx={{ minHeight: '40px', width: '100%' }} onClick={() => doSwap()} loading={swapLoading}>
									{!swapLoading && `Swap via ${aggregator}`}
								</Button>
							) : (
								<Button sx={{ minHeight: '40px', width: '100%' }} disabled>
									Insufficiant Balance
								</Button>
							))}
						{address && (!aggregator || swapRoutes.length === 0) && (
							<Button sx={{ minHeight: '40px', width: '100%' }} disabled>
								Select aggregator
							</Button>
						)}
					</div>
				</CardOverflow>
			</Card>
			<Card className="routes-card" variant="soft">
				<CardContent orientation="vertical" sx={{ gap: '10px' }}>
					<List sx={{ gap: '10px', '--ListDivider-gap': 0 }}>
						{quoteLoading && (
							<>
								<ListItemButton
									className="aggregator-route loading"
									sx={{ borderRadius: '8px', minHeight: '58px', pointerEvents: 'none', filter: 'blur(4px)' }}
									key="skeleton-1"
								>
									<img alt="logo" src={`/images/aggregator/avnu.svg`} width="80"></img>
									<div className="output-amount">
										<Typography fontWeight="lg" fontSize="lg">
											4 {buyToken?.symbol}
										</Typography>
										<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
											≈{' '}
											{new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(222)}{' '}
											after fees
										</Typography>
									</div>
									<div className="extra-infos">
										<Typography fontWeight="lg" fontSize="sm" color="success"></Typography>
										<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
											<LocalGasStation sx={{ width: '20px', height: '20px', marginRight: '2px', verticalAlign: 'sub' }}></LocalGasStation>
											{new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(2.3)}
										</Typography>
									</div>
								</ListItemButton>
								<ListItemButton
									className="aggregator-route loading"
									sx={{ borderRadius: '8px', minHeight: '58px', pointerEvents: 'none', filter: 'blur(4px)' }}
									key="skeleton-2"
								>
									<img alt="logo" src={`/images/aggregator/fibrous.svg`} width="80"></img>
									<div className="output-amount">
										<Typography fontWeight="lg" fontSize="lg">
											4 {buyToken?.symbol}
										</Typography>
										<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
											≈{' '}
											{new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(222)}{' '}
											after fees
										</Typography>
									</div>
									<div className="extra-infos">
										<Typography fontWeight="lg" fontSize="sm" color="success"></Typography>
										<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
											<LocalGasStation sx={{ width: '20px', height: '20px', marginRight: '2px', verticalAlign: 'sub' }}></LocalGasStation>
											{new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
											}).format(2.3)}
										</Typography>
									</div>
								</ListItemButton>
							</>
						)}
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
									{swapRoute.outputAmountWithGasUsd ? (
										swapRoute.gasFeesUsd > 0 ? (
											<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
												≈{' '}
												{new Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
												}).format(swapRoute.outputAmountWithGasUsd)}{' '}
												after fees
											</Typography>
										) : (
											<Typography fontWeight="sm" fontSize="sm" fontStyle="italic" color="warning">
												≈{' '}
												{new Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
												}).format(swapRoute.outputAmountWithGasUsd)}{' '}
												before fees
											</Typography>
										)
									) : (
										''
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
			<Snackbar
				variant="soft"
				color={snackbar === 'success' ? 'success' : 'danger'}
				size="lg"
				open={snackbar === 'success' || snackbar === 'error'}
				onClose={() => setSnackbar(undefined)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				startDecorator={snackbar === 'success' ? <Verified /> : <Error />}
				autoHideDuration={10000}
				onClick={() => setSnackbar(undefined)}
				sx={{ cursor: 'pointer' }}
			>
				{snackbar === 'success' ? 'Swap on the way... transaction sent.' : 'Oops something went wrong... transaction failed.'}
			</Snackbar>
		</div>
	);
}

export default Swap;
