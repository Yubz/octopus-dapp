import { Button, ButtonGroup, Card } from '@mui/joy';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ConnectWallet from '../connect-wallet/connect-wallet';
import { useAccount, useConnect } from '@starknet-react/core';
import DisconnectWallet from '../disconnect-wallet/disconnect-wallet';

export interface HeaderProps {}

export function Header(headerProps: HeaderProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const { address, connector } = useAccount();
	const { connect, connectors } = useConnect();

	const [locationPathname, setLocationPathname] = useState('');
	const [connectWalletOpened, setConnectWalletOpened] = useState<boolean>(false);
	const [disconnectWalletOpened, setDisconnectWalletOpened] = useState<boolean>(false);

	const closeConnectWalletModal = useCallback(() => {
		setConnectWalletOpened(false);
	}, []);

	const closeDisconnectWalletModal = useCallback(() => {
		setDisconnectWalletOpened(false);
	}, []);

	useEffect(() => {
		setLocationPathname(location.pathname);
		const lastUsedConnector = localStorage.getItem('lastUsedConnector');
		if (lastUsedConnector) {
			connect({ connector: connectors.find((connector) => connector.name === lastUsedConnector) });
		}
	}, [location, connect, connectors]);

	useEffect(() => {
		if (address) {
			setConnectWalletOpened(false);
		} else {
			setDisconnectWalletOpened(false);
		}
	}, [address]);

	function minimizeAddress(address: string): string {
		return address.substring(0, 6) + '...' + address.slice(-4);
	}

	function handleWallet() {
		if (address) {
			setDisconnectWalletOpened(true);
		} else {
			setConnectWalletOpened(true);
		}
	}

	return (
		<>
			<div className="header-content">
				<Link to="/">
					<img src="/images/octopus.png" alt="logo" width="80px" />
				</Link>
				<Card
					size="sm"
					variant="soft"
					sx={{
						width: 'fit-content',
						padding: '0.25rem',
						height: 'fit-content',
						alignSelf: 'center',
						backgroundColor: 'rgba(0, 0, 0, 0.4)',
					}}
				>
					<ButtonGroup size="lg" spacing="0.5rem">
						<Button
							color={locationPathname === '/monitor' ? 'primary' : 'neutral'}
							size="md"
							variant="soft"
							sx={{ borderRight: 'none !important' }}
							onClick={() => navigate('/monitor')}
						>
							Monitor
						</Button>
						<Button
							color={locationPathname === '/explore' ? 'primary' : 'neutral'}
							size="md"
							variant="soft"
							sx={{ borderLeft: 'none !important', borderRight: 'none !important' }}
							onClick={() => navigate('/explore')}
						>
							Explore
						</Button>
						<Button
							color={locationPathname === '/swap' ? 'primary' : 'neutral'}
							size="md"
							variant="soft"
							sx={{ borderLeft: 'none !important' }}
							onClick={() => navigate('/swap')}
						>
							Swap
						</Button>
					</ButtonGroup>
				</Card>
				<Card
					size="sm"
					variant="soft"
					sx={{
						marginLeft: 'auto',
						width: 'fit-content',
						padding: '0.25rem',
						height: 'fit-content',
						alignSelf: 'center',
						backgroundColor: 'rgba(0, 0, 0, 0)',
					}}
				>
					<ButtonGroup size="lg" spacing="0.5rem">
						<Button size="md" variant="soft" color="primary" onClick={() => handleWallet()}>
							{address ? minimizeAddress(address) : 'Connect Wallet'}
						</Button>
					</ButtonGroup>
				</Card>
			</div>
			<ConnectWallet opened={connectWalletOpened} onClose={closeConnectWalletModal}></ConnectWallet>
			<DisconnectWallet opened={disconnectWalletOpened} address={address} connector={connector} onClose={closeDisconnectWalletModal}></DisconnectWallet>
		</>
	);
}

export default Header;
