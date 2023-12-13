import { Button, DialogActions, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy';
import { Connector, useDisconnect } from '@starknet-react/core';
import { useEffect, useState } from 'react';

export interface DisconnectWalletProps {
	opened: boolean;
	connector?: Connector;
	address?: string;
	onClose: () => void;
}

export function DisconnectWallet(disconnectWalletProps: DisconnectWalletProps) {
	const [opened, setOpened] = useState<boolean>(disconnectWalletProps.opened);
	const [connector, setConnector] = useState<Connector>();
	const [address, setAddress] = useState<string>();

	const { disconnect } = useDisconnect();

	useEffect(() => {
		setOpened(disconnectWalletProps.opened);
		setConnector(disconnectWalletProps.connector);
		setAddress(disconnectWalletProps.address);
	}, [disconnectWalletProps]);

	function minimizeAddress(address?: string): string {
		return address?.substring(0, 6) + '...' + address?.slice(-4);
	}

	function handleDisconnect() {
		disconnect();
		localStorage.removeItem('lastUsedConnector');
	}

	return (
		<Modal open={opened} onClose={() => disconnectWalletProps.onClose()} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem 1rem' }}>
			<ModalDialog variant="soft">
				<DialogTitle>Wallet</DialogTitle>
				<DialogContent sx={{ border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '1rem', margin: 0 }}>
					<ModalClose variant="soft" sx={{ m: 1 }} />
					<Typography fontWeight="md" fontSize="sm">
						Connected with {connector?.id === 'argentX' ? 'Argent X' : 'Braavos'}
					</Typography>
					<Typography fontWeight="lg" fontSize="md">
						{minimizeAddress(address)}
					</Typography>
				</DialogContent>
				<DialogActions sx={{ padding: 0 }}>
					<Button size="md" variant="soft" color="primary" onClick={() => handleDisconnect()}>
						Disconnect
					</Button>
				</DialogActions>
			</ModalDialog>
		</Modal>
	);
}

export default DisconnectWallet;
