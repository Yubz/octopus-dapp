import { List, Modal, ModalClose, Sheet, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import TokenItem from '../token-item/token-item';

export interface Token {
	decimals: number;
	l2_token_address: string;
	name: string;
	sort_order: number;
	symbol: string;
	hidden: boolean;
	balance: number;
}

export interface TokensModalProps {
	opened: boolean;
	selectedToken?: Token;
	onClose: (token?: Token) => void;
}

export function TokensModal(tokensModalProps: TokensModalProps) {
	const [opened, setOpened] = useState<boolean>(tokensModalProps.opened);
	const [tokens, setTokens] = useState<Array<Token>>([]);

	useEffect(() => {
		fetchTokens();
	}, []);

	useEffect(() => {
		setOpened(tokensModalProps.opened);
	}, [tokensModalProps]);

	async function fetchTokens() {
		let tokens: Array<Token> = await fetch('https://mainnet-api.ekubo.org/tokens').then((res) => res.json());
		setTokens(tokens.filter((token) => !token.hidden).sort((tokenA, tokenB) => tokenA.sort_order - tokenB.sort_order));
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
					height: '40vh',
					borderRadius: 'md',
					p: 3,
					boxShadow: 'lg',
				}}
			>
				<ModalClose variant="soft" sx={{ m: 1 }} />
				<Typography fontWeight="lg" fontSize="lg">
					Select a token
				</Typography>
				<List sx={{ marginTop: '12px', maxHeight: 'calc(100% - 2rem)', overflowY: 'scroll', '--ListDivider-gap': 0 }}>
					{tokens.map((token) => (
						<TokenItem token={token} selected={tokensModalProps.selectedToken === token} onChoose={tokensModalProps.onClose} key={token.symbol}></TokenItem>
					))}
				</List>
			</Sheet>
		</Modal>
	);
}

export default TokensModal;
