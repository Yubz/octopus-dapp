import { Table, Box, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';

export interface PositionsTableProps {
	positions: Array<PositionRowProps>;
}

export interface PositionRowProps {
	id: number;
	owner: string;
	inRange: boolean;
	token0Symbol: string;
	token1Symbol: string;
	fee: number;
	tickSpacing: number;
	amountUsd: number;
	pnlUsd: number;
	feeApr: number;
	apr: number;
	durationInDays: number;
}

const POSITIONS_PER_PAGE = 10;

export function PositionsTable(positionsTableProps: PositionsTableProps) {
	const [positions, setPositions] = useState<Array<PositionRowProps>>([]);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [numberOfPages, setNumberOfPages] = useState<number>(0);

	useEffect(() => {
		setCurrentPage(0);
		setPositions(positionsTableProps.positions);
		setNumberOfPages(Math.ceil(positionsTableProps.positions.length / POSITIONS_PER_PAGE));
	}, [positionsTableProps]);

	const minimizeAddress = (address: string): string => {
		return address.substring(0, 6) + '...' + address.slice(-4);
	};

	const pageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value - 1);
	};

	return (
		<>
			<Table
				hoverRow
				variant="soft"
				sx={{
					borderRadius: '8px',
					'& tr > *:not(:first-of-type)': { textAlign: 'right' },
					backgroundColor: '#171A1C',
				}}
			>
				<thead style={{ backgroundColor: '#171A1C' }}>
					<tr>
						<th style={{ verticalAlign: 'middle' }}>Pool</th>
						<th style={{ verticalAlign: 'middle' }}>NFT_ID / Owner</th>
						<th style={{ verticalAlign: 'middle' }}>PNL</th>
						<th style={{ verticalAlign: 'middle' }}>APR</th>
						<th style={{ verticalAlign: 'middle' }}>Fee APR</th>
						<th style={{ verticalAlign: 'middle' }}>Value</th>
						<th style={{ verticalAlign: 'middle' }}>Age</th>
					</tr>
				</thead>
				<tbody>
					{positions.map(
						(position, index) =>
							index >= currentPage * POSITIONS_PER_PAGE &&
							index <= currentPage * POSITIONS_PER_PAGE + POSITIONS_PER_PAGE && (
								<tr key={position.id}>
									<td>
										<Typography fontWeight="lg">
											{position.token0Symbol}/{position.token1Symbol}
										</Typography>
										<Typography level="body-xs" fontWeight="lg">
											{position.fee * 100}% - {position.tickSpacing * 100}%
										</Typography>
									</td>
									<td>
										<Typography fontWeight="lg">{position.id}</Typography>
										<Typography level="body-xs" fontWeight="lg">
											{minimizeAddress(position.owner)}
										</Typography>
									</td>
									<td>
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
										}).format(position.pnlUsd)}
									</td>
									<td>{(position.apr * 100).toFixed(2)}%</td>
									<td>{(position.feeApr * 100).toFixed(2)}%</td>
									<td>
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
										}).format(position.amountUsd)}
									</td>
									<td>
										<Typography level="body-xs" fontWeight="lg">
											{position.durationInDays.toFixed(2)} days
										</Typography>
									</td>
								</tr>
							),
					)}
				</tbody>
				<tfoot>
					<tr>
						<td
							colSpan={7}
							style={{
								borderBottomLeftRadius: '8px',
								borderBottomRightRadius: '8px',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									justifyContent: 'center',
								}}
							>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<Pagination variant="outlined" count={numberOfPages} onChange={pageChange} shape="rounded" color="primary" />
								</Box>
							</Box>
						</td>
					</tr>
				</tfoot>
			</Table>
		</>
	);
}

export default PositionsTable;
