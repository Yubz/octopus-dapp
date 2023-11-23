import { useEffect, useState } from 'react';
import { PositionsTable, PositionRowProps } from '../../ui/positions-table/positions-table';
import { getPositionsExplore } from '../../utils/position';

export function Explore() {
	const [positions, setPositions] = useState<Array<PositionRowProps>>([]);

	useEffect(() => {
		init();
	}, []);

	async function init() {
		const positionsUi = await getPositionsExplore();
		const positionsTable: Array<PositionRowProps> = positionsUi.map((positionUi) => {
			return {
				id: positionUi.id,
				owner: positionUi.owner,
				inRange: positionUi.inRange,
				token0Symbol: positionUi.token0Symbol,
				token1Symbol: positionUi.token1Symbol,
				fee: positionUi.fee,
				tickSpacing: positionUi.tickSpacing,
				amount: positionUi.totalCurrentAmount,
				pnl: positionUi.totalPnl,
				feeApr: positionUi.feeApr,
				totalApr: positionUi.totalApr,
				durationInDays: positionUi.durationPositionInDays,
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
