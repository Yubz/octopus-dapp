import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './ui/layout/layout';
import Monitor from './pages/monitor/monitor';
import Explore from './pages/explore/explore';
import Swap from './pages/swap/swap';
import { StarknetConfig, argent, braavos, publicProvider } from '@starknet-react/core';
import { mainnet } from '@starknet-react/chains';

function App() {
	const chains = [mainnet];
	const provider = publicProvider();
	const connectors = [argent(), braavos()];

	return (
		<StarknetConfig chains={chains} provider={provider} connectors={connectors}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route path="" element={<Navigate to="/monitor" />} />
						<Route path="monitor" element={<Monitor />} />
						<Route path="explore" element={<Explore />} />
						<Route path="swap" element={<Swap />} />
						<Route path="*" element={<Navigate to="/monitor" />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</StarknetConfig>
	);
}

export default App;
