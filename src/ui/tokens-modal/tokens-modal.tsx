import { List, Modal, ModalClose, Sheet, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import TokenItem from '../token-item/token-item';
import { TOKENS, Token } from '../../services/token.service';

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
		setTokens(TOKENS.sort((tokenA, tokenB) => tokenA.sort_order - tokenB.sort_order));
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
