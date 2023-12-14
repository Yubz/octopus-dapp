import { ListItemButton, ListItemDecorator, Typography } from '@mui/joy';
import { useAccount, useBalance } from '@starknet-react/core';
import { Token } from '../../services/token.service';

export interface TokenItemProps {
	token: Token;
	selected?: boolean;
	onChoose: (token: Token) => void;
}

export function TokenItem(tokenItemProps: TokenItemProps) {
	const { address } = useAccount();
	const { data } = useBalance({
		address,
		token: tokenItemProps.token.l2_token_address,
		watch: false,
	});

	return (
		<ListItemButton
			variant="soft"
			sx={{ borderRadius: '8px', marginRight: '10px', opacity: tokenItemProps.selected ? '0.4' : '1' }}
			onClick={() => tokenItemProps.onChoose(tokenItemProps.token)}
			disabled={tokenItemProps.selected}
		>
			<ListItemDecorator>
				<img
					height="35"
					width="35"
					src={
						tokenItemProps.token.added_by_user
							? '/images/tokens/unknown_token.svg'
							: 'https://mainnet-api.ekubo.org/tokens/' + tokenItemProps.token.l2_token_address + '/logo.svg'
					}
					alt={`${tokenItemProps.token.symbol}-logo`}
				/>
				<div className="token-info">
					<Typography fontWeight="lg" fontSize="lg">
						{tokenItemProps.token.symbol}
					</Typography>
					<Typography fontWeight="sm" fontSize="sm" fontStyle="italic">
						{tokenItemProps.token.name}
					</Typography>
				</div>
			</ListItemDecorator>
			{address && (
				<Typography fontWeight="sm" fontSize="sm" sx={{ marginLeft: 'auto' }}>
					{Number(Number(data?.formatted).toFixed(4)) > 0 ? Number(data?.formatted).toFixed(4) : '0'}
				</Typography>
			)}
		</ListItemButton>
	);
}

export default TokenItem;
