import { Search } from '@mui/icons-material';
import { Input } from '@mui/joy';
import { useEffect, useState } from 'react';
import PositionCard from '../../ui/position-card/position-card';
import { getPositionsByAddress } from '../../services/position.service';
import { PositionCardDto } from '../../dto/position-card.dto';
import { useAccount } from '@starknet-react/core';
import { useSearchParams } from 'react-router-dom';

export function Monitor() {
	const [positionCards, setPositionCards] = useState<Array<PositionCardDto>>([]);
	const [inputAddress, setInputAddress] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const { address } = useAccount();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		if (searchParams) {
			setInputAddress(searchParams.get('address') || '');
		} else if (address) {
			setInputAddress(address);
		}
	}, [address]);

	useEffect(() => {
		setPositionCards([]);
		if (inputAddress && inputAddress.length > 0) {
			fetch();
		}
		// eslint-disable-next-line
	}, [inputAddress]);

	async function fetch() {
		setLoading(true);
		setPositionCards(await getPositionsByAddress(inputAddress));
		setLoading(false);
	}

	return (
		<>
			<div className="search-address">
				<Input
					placeholder="Search address…"
					value={inputAddress}
					variant="soft"
					sx={{ '--Input-focusedThickness': 0, backgroundColor: 'rgba(0,0,0,0.4)' }}
					startDecorator={<Search />}
					onChange={(event) => setInputAddress(event.target.value)}
				/>
			</div>
			<div className="positions">
				{loading && (
					<div className="loading">
						<PositionCard
							id={9999}
							owner={'0x000000000000000000000000000000000000000000000000000000000000000'}
							currentPrice={'1.1517345'}
							token0Symbol={'wstETH'}
							token1Symbol={'ETH'}
							minPrice={'1.1479755'}
							maxPrice={'1.1530377'}
							fee={0.0001}
							tickSpacing={0.0002}
							feesUsd={37.21023524198485}
							amount0={0.3851937636686945}
							amount1={1.2818638197847898}
							depositedAmount0={1.5}
							depositedAmount1={0}
							amountUsd={3841.4619276720446}
							durationInDays={45.19516677083333}
							feeApr={0.07813765251489482}
							inRange={true}
							apr={0.06872630406773979}
							pnlUsd={32.72842041402886}
						/>
						<PositionCard
							id={9999}
							owner={'0x000000000000000000000000000000000000000000000000000000000000000'}
							currentPrice={'1.1517345'}
							token0Symbol={'wstETH'}
							token1Symbol={'ETH'}
							minPrice={'1.1479755'}
							maxPrice={'1.1530377'}
							fee={0.0001}
							tickSpacing={0.0002}
							feesUsd={37.21023524198485}
							amount0={0.3851937636686945}
							amount1={1.2818638197847898}
							depositedAmount0={1.5}
							depositedAmount1={0}
							amountUsd={3841.4619276720446}
							durationInDays={45.19516677083333}
							feeApr={0.07813765251489482}
							inRange={false}
							apr={0.06872630406773979}
							pnlUsd={32.72842041402886}
						/>
					</div>
				)}
				{(() => {
					const arr = [];
					for (let i = 0; i < positionCards.length; i++) {
						const positionCard = positionCards[i];
						arr.push(
							<div className="position-card" key={positionCard.id}>
								<PositionCard
									id={positionCard.id}
									owner={positionCard.owner}
									currentPrice={positionCard.currentPrice}
									token0Symbol={positionCard.token0Symbol}
									token1Symbol={positionCard.token1Symbol}
									minPrice={positionCard.minPrice}
									maxPrice={positionCard.maxPrice}
									fee={positionCard.fee}
									tickSpacing={positionCard.tickSpacing}
									feesUsd={positionCard.feesUsd}
									amount0={positionCard.amount0}
									amount1={positionCard.amount1}
									depositedAmount0={positionCard.depositedAmount0}
									depositedAmount1={positionCard.depositedAmount1}
									amountUsd={positionCard.amountUsd}
									durationInDays={positionCard.durationInDays}
									feeApr={positionCard.feeApr}
									inRange={positionCard.inRange}
									apr={positionCard.apr}
									pnlUsd={positionCard.pnlUsd}
								/>
							</div>,
						);
					}
					return arr;
				})()}
			</div>
		</>
	);
}

export default Monitor;
