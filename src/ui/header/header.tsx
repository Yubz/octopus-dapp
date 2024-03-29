import { Button, ButtonGroup, Card } from '@mui/joy';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ConnectWallet from '../connect-wallet/connect-wallet';
import { useAccount, useConnect, useStarkProfile } from '@starknet-react/core';
import DisconnectWallet from '../disconnect-wallet/disconnect-wallet';

export interface HeaderProps {}

export function Header(headerProps: HeaderProps) {
	const location = useLocation();
	//const navigate = useNavigate();
	const { address, connector } = useAccount();
	const { data } = useStarkProfile({ address });
	const { connect, connectors } = useConnect();

	// eslint-disable-next-line
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

	function handleWalletLabel(): string {
		if (data?.name) return data.name;
		else if (address) return address.substring(0, 6) + '...' + address.slice(-4);
		else return 'Connect Wallet';
	}

	function handleWalletAction() {
		if (address) {
			setDisconnectWalletOpened(true);
		} else {
			setConnectWalletOpened(true);
		}
	}

	return (
		<>
			<div className="header-content" style={{ marginTop: '20px' }}>
				<Link to="/" style={{ textDecoration: 'none', color: 'GrayText', position: 'relative', width: '100%' }}>
					<h2 style={{ display: 'flex', alignItems: 'center', fontSize: '50px', marginTop: 0, marginBottom: 0 }}>
						<img src="/images/octoswap.png" alt="logo" width="60px" />
						<span className="app-title">OctoSwap</span>
					</h2>
				</Link>
				{/* <Card
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
				</Card> */}
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
						<Button size="lg" variant="soft" color="primary" onClick={() => handleWalletAction()} sx={{ minWidth: 'max-content' }}>
							{handleWalletLabel()}
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
