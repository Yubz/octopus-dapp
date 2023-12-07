import { List, ListItemButton, ListItemDecorator, Modal, ModalClose, Sheet, Typography } from '@mui/joy';
import { useConnect, Connector } from '@starknet-react/core';
import { useEffect, useState } from 'react';

export interface ConnectWalletProps {
	opened: boolean;
	onClose: () => void;
}

export function ConnectWallet(connectWalletProps: ConnectWalletProps) {
	const [opened, setOpened] = useState<boolean>(connectWalletProps.opened);

	const { connect, connectors } = useConnect();

	useEffect(() => {
		setOpened(connectWalletProps.opened);
	}, [connectWalletProps.opened]);

	function connectWallet(connector: Connector) {
		if (connector.available()) {
			connect({ connector });
		} else {
			if (connector.name === 'argentX') {
				window.open('https://www.argent.xyz', '_blank');
			} else if (connector.name === 'braavos') {
				window.open('https://braavos.app', '_blank');
			}
		}
	}

	return (
		<Modal open={opened} onClose={() => connectWalletProps.onClose()} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Sheet
				variant="soft"
				sx={{
					width: '25rem',
					borderRadius: 'md',
					p: 3,
					boxShadow: 'lg',
				}}
			>
				<ModalClose variant="soft" sx={{ m: 1 }} />
				<Typography fontWeight="lg" fontSize="lg">
					Connect a wallet
				</Typography>
				<List sx={{ marginTop: '12px', maxHeight: 'calc(100% - 2rem)', overflowY: 'scroll', '--ListDivider-gap': 0 }}>
					{connectors.map((connector: Connector) => (
						<ListItemButton variant="soft" sx={{ borderRadius: '8px', padding: '1rem' }} onClick={() => connectWallet(connector)} key={connector.id}>
							<ListItemDecorator sx={{ position: 'absolute' }}>
								{connector.id === 'argentX' && <img src="/images/wallet/argentx.png" width="20" height="20" alt="argent-logo"></img>}
								{connector.id === 'braavos' && <img src="/images/wallet/braavos.svg" width="20" height="20" alt="braavos-logo"></img>}
							</ListItemDecorator>
							<Typography fontWeight="md" fontSize="lg" sx={{ margin: 'auto' }}>
								{!connector.available() && 'Install '}
								{connector.id === 'argentX' && 'Argent X'}
								{connector.id === 'braavos' && 'Braavos'}
							</Typography>
						</ListItemButton>
					))}
				</List>
			</Sheet>
		</Modal>
	);
}

export default ConnectWallet;
