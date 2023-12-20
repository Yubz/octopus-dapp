import { useEffect, useState } from 'react';
import { PositionsTable, PositionRowProps } from '../../ui/positions-table/positions-table';
import { getPositionsExplore } from '../../services/position.service';

const POSITION_LOADING = {
	id: 1,
	owner: '0x0000000000000000000000000000000',
	inRange: true,
	token0Symbol: 'wstETH',
	token1Symbol: 'string',
	fee: 0.05,
	tickSpacing: 0.3,
	amountUsd: 1555,
	pnlUsd: 999,
	feeApr: 0.5,
	apr: 0.9,
	durationInDays: 99,
};

export function Explore() {
	const [positions, setPositions] = useState<Array<PositionRowProps>>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		init();
	}, []);

	async function init() {
		setLoading(true);
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
		setLoading(false);
	}

	function getPositionsLoading() {
		const positionsLoading = [];
		for (let index = 0; index < 22; index++) {
			const positionLoading = Object.assign({}, POSITION_LOADING);
			positionLoading.id = index + 1;
			positionsLoading.push(positionLoading);
		}
		return positionsLoading;
	}

	return (
		<>
			{loading && (
				<div className="loading">
					<PositionsTable positions={getPositionsLoading()}></PositionsTable>
				</div>
			)}
			<PositionsTable positions={positions}></PositionsTable>
		</>
	);
}

export default Explore;
