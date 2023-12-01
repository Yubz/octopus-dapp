import { useEffect, useState } from 'react';
import { PositionsTable, PositionRowProps } from '../../ui/positions-table/positions-table';
import { getPositionsExplore } from '../../services/position.service';

export function Explore() {
	const [positions, setPositions] = useState<Array<PositionRowProps>>([]);

	useEffect(() => {
		init();
	}, []);

	async function init() {
		const positions = await getPositionsExplore();
		const positionsTable: Array<PositionRowProps> = positions.map((position) => {
			return {
				id: position.id,
				owner: position.owner,
				inRange: position.inRange,
				token0Symbol: position.token0Symbol,
				token1Symbol: position.token1Symbol,
				fee: position.fee,
				tickSpacing: position.tickSpacing,
				amountUsd: position.amountUsd,
				pnlUsd: position.pnlUsd,
				feeApr: position.feeApr,
				apr: position.apr,
				durationInDays: position.durationInDays,
			};
		});
		setPositions(positionsTable);
	}

	return (
		<>
			<PositionsTable positions={positions}></PositionsTable>
		</>
	);
}

export default Explore;
