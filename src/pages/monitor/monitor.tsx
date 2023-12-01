import { Search } from '@mui/icons-material';
import { Input } from '@mui/joy';
import { useEffect, useState } from 'react';
import PositionCard from '../../ui/position-card/position-card';
import { getPositionsByAddress } from '../../services/position.service';
import { PositionCardDto } from '../../dto/position-card.dto';

export function Monitor() {
	const [positionCards, setPositionCards] = useState<Array<PositionCardDto>>([]);
	const [address, setAddress] = useState<string>('');

	useEffect(() => {
		setPositionCards([]);
		setAddress(address);
		if (address && address.length > 0) {
			fetch();
		}
	}, [address]);

	async function fetch() {
		const positionCards = await getPositionsByAddress(address);

		setPositionCards(positionCards);
	}

	return (
		<>
			<div className="search-address">
				<Input
					placeholder="Search address…"
					variant="soft"
					sx={{ '--Input-focusedThickness': 0 }}
					startDecorator={<Search />}
					onChange={(event) => setAddress(event.target.value)}
				/>
			</div>
			<div className="positions">
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
