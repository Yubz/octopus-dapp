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
import { KeyboardArrowDown, ImportExport } from '@mui/icons-material';

interface Token {
	decimals: number;
	l2_token_address: string;
	name: string;
	sort_order: number;
	symbol: string;
	hidden: boolean;
}

export function Swap() {
	const [sellToken, setSellToken] = useState<Token>();
	const [sellTokenAmount, setSellTokenAmount] = useState<number>(0);
	const [sellTokenAmountUsd, setSellTokenAmountUsd] = useState<number>();
	const [sellTokenWalletAmount, setSellTokenWalletAmount] = useState<number>();

	const [buyToken, setBuyToken] = useState<Token>();
	const [buyTokenAmount, setBuyTokenAmount] = useState<number>(0);
	const [buyTokenAmountUsd, setBuyTokenAmountUsd] = useState<number>();
	const [buyTokenWalletAmount, setBuyTokenWalletAmount] = useState<number>();

	const [tokens, setTokens] = useState<Array<Token>>([]);
	const [openTokenModal, setOpenTokenModal] = useState<'buy' | 'sell'>();

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
			setBuyTokenAmountUsd(0);
			setSellTokenAmountUsd(undefined);
		} else if (sellToken && sellTokenAmount && buyToken) {
			const params = {
				sellTokenAddress: sellToken.l2_token_address,
				buyTokenAddress: buyToken.l2_token_address,
				sellAmount: BigNumber.from(parseUnits(sellTokenAmount.toString(), sellToken.decimals)).toBigInt(),
				//takerAddress: '',
			};
			const quotes = await fetchQuotes(params);
			setBuyTokenAmount(Number(formatUnits(quotes[0].buyAmount, buyToken.decimals)));
			setSellTokenAmountUsd(quotes[0].sellAmountInUsd);

			//await executeSwap(account, quotes[0]);

			const inputAmount = BigNumber.from(parseUnits(sellTokenAmount.toString(), sellToken.decimals)); // for 1 Ether
			const router = new FibrousRouter();
			const route = (await router.getBestRoute(
				inputAmount, // amount
				sellToken.l2_token_address, // token input
				buyToken.l2_token_address, // token output
			)) as RouteSuccess;
			console.log(formatUnits(route.outputAmount, buyToken.decimals));
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

	return (
		<>
			<Card
				className="quote-card"
				variant="soft"
				sx={{
					border: '1px solid',
					borderColor: '#76afcc',
				}}
			>
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
					<Typography component="h2" id="modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={1}>
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
		</>
	);
}

export default Swap;
