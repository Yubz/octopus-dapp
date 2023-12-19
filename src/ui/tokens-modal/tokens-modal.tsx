import { Input, List, Modal, ModalClose, Sheet, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import TokenItem from '../token-item/token-item';
import { TOKENS, Token } from '../../services/token.service';
import { Search } from '@mui/icons-material';
import { useContract } from '@starknet-react/core';
import { ERC20_TOKEN_ABI } from './erc20-token-abi';
import { shortString } from 'starknet';

export interface TokensModalProps {
	opened: boolean;
	selectedToken?: Token;
	onClose: (token?: Token) => void;
}

export function TokensModal(tokensModalProps: TokensModalProps) {
	const [opened, setOpened] = useState<boolean>(tokensModalProps.opened);
	const [tokens, setTokens] = useState<Array<Token>>([]);
	const [inputSearchToken, setInputSearchToken] = useState<string>();
	const { contract } = useContract({
		abi: ERC20_TOKEN_ABI,
		address: inputSearchToken,
	});

	useEffect(() => {
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		setOpened(tokensModalProps.opened);
		fetchTokens();
		setInputSearchToken(undefined);
	}, [tokensModalProps.opened]);

	useEffect(() => {
		fetchTokenInfo();
		// eslint-disable-next-line
	}, [contract, inputSearchToken]);

	async function fetchTokenInfo() {
		if (contract) {
			try {
				const name = await contract.name();
				const symbol = await contract.symbol();
				const decimals = await contract.decimals();
				const storedTokens = JSON.parse(localStorage.getItem('storedTokens') || '[]');
				if (!TOKENS.find((token) => token.l2_token_address === inputSearchToken) && !storedTokens.find((token: Token) => token.l2_token_address === inputSearchToken)) {
					const token: Token = {
						name: shortString.decodeShortString(name),
						symbol: shortString.decodeShortString(symbol),
						decimals: Number(decimals),
						logo: '/images/tokens/unknown-token.svg',
						l2_token_address: inputSearchToken!,
						id: shortString.decodeShortString(name),
						sort_order: 999,
						added_by_user: true,
					};
					storedTokens.push(token);
					localStorage.setItem('storedTokens', JSON.stringify(storedTokens));
				}
			} catch (error) {}
		}
		fetchTokens();
	}

	async function fetchTokens() {
		let tokens: Array<Token> = Object.assign([], TOKENS) as Array<Token>;
		const storedTokens = JSON.parse(localStorage.getItem('storedTokens') || '[]');
		storedTokens.forEach((storedToken: Token) => {
			if (!tokens.find((token) => token.l2_token_address === storedToken.l2_token_address)) {
				tokens.push(storedToken);
			}
		});
		tokens = tokens.sort((tokenA, tokenB) => tokenA.sort_order - tokenB.sort_order);
		if (inputSearchToken) {
			setTokens(tokens.filter((data) => JSON.stringify(data).toLowerCase().indexOf(inputSearchToken.toLowerCase()) !== -1));
		} else {
			setTokens(tokens);
		}
	}

	return (
		<Modal
			className="token-modal"
			open={opened}
			onClose={() => tokensModalProps.onClose(undefined)}
			sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
		>
			<Sheet
				variant="soft"
				sx={{
					width: '500px',
					height: '60vh',
					borderRadius: 'md',
					p: 3,
					boxShadow: 'lg',
				}}
			>
				<ModalClose variant="soft" sx={{ m: 1 }} />
				<Typography fontWeight="lg" fontSize="lg">
					Select a token
				</Typography>
				<Input
					placeholder="Type token name or address"
					variant="outlined"
					sx={{ '--Input-focusedThickness': 0, marginTop: '1rem' }}
					startDecorator={<Search />}
					onChange={(event) => setInputSearchToken(event.target.value)}
				/>
				<List sx={{ marginTop: '12px', maxHeight: 'calc(100% - 4.5rem)', overflowY: 'scroll', '--ListDivider-gap': 0 }}>
					{tokens.map((token) => (
						<TokenItem token={token} selected={tokensModalProps.selectedToken === token} onChoose={tokensModalProps.onClose} key={token.symbol}></TokenItem>
					))}
				</List>
			</Sheet>
		</Modal>
	);
}

export default TokensModal;
