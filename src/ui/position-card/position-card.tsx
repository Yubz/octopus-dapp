import { Card, CardContent, Typography, Sheet, Divider, CardOverflow, Chip, Grid, Tooltip } from '@mui/joy';
import { styled } from '@mui/joy/styles';
import { Timer, Straighten, TableRows, LocalAtm } from '@mui/icons-material';

const Item = styled(Sheet)(({ theme }) => ({
	...theme.typography['body-sm'],
	//textAlign: 'center',
	alignItems: 'center',
	justifyContent: 'center',
	//fontWeight: theme.fontWeight.md,
	//color: theme.vars.palette.text.secondary,
	//borderColor: theme.palette.divider,
	padding: theme.spacing(2),
	//borderRadius: theme.radius.md,
}));

export interface PositionCardProps {
	id: number;
	owner: string;
	token0Symbol: string;
	token1Symbol: string;
	fee: number;
	tickSpacing: number;
	minPrice: string;
	maxPrice: string;
	currentPrice: string;
	amount0: number;
	amount1: number;
	amountUsd: number;
	depositedAmount0: number;
	depositedAmount1: number;
	inRange: boolean;
	feesUsd: number;
	pnlUsd: number;
	durationInDays: number;
	apr: number;
	feeApr: number;
}

export function PositionCard(positionCardProps: PositionCardProps) {
	function interpolateValue(A: string, B: string, C: string): string {
		const A_prime = 20;
		const B_prime = 80;
		let C_prime = A_prime + ((Number(C) - Number(A)) / (Number(B) - Number(A))) * (B_prime - A_prime);
		C_prime = C_prime < 0 ? 0 : C_prime > 100 ? 100 : C_prime;
		return C_prime.toString() + '%';
	}

	return (
		<Card
			className="position-card"
			variant="soft"
			sx={{
				border: '1px solid',
				borderColor: positionCardProps.inRange ? '#0AD85E' : '#FF2E60',
			}}
		>
			<CardOverflow
				sx={{
					borderBottom: '1px solid',
					borderColor: positionCardProps.inRange ? '#0AD85E' : '#FF2E60',
				}}
			>
				<Divider />
				<CardContent orientation="horizontal">
					<img src="/images/ekubo.png" alt="Ekubo Protocol" width="115px" />
					<Divider orientation="vertical" />
					<Typography fontWeight="md" lineHeight="28px">
						{positionCardProps.token0Symbol}-{positionCardProps.token1Symbol}
					</Typography>
					<Divider orientation="vertical" />
					<Typography fontWeight="md" lineHeight="28px">
						<TableRows style={{ height: '28px', verticalAlign: 'bottom' }} /> {positionCardProps.fee * 100}%
					</Typography>
					<Divider orientation="vertical" />
					<Typography fontWeight="md" lineHeight="28px">
						<Straighten style={{ height: '28px', verticalAlign: 'bottom' }} /> {positionCardProps.tickSpacing * 100}%
					</Typography>
					<Divider orientation="vertical" />
					<Typography fontWeight="md" lineHeight="28px">
						<LocalAtm style={{ height: '28px', verticalAlign: 'bottom' }} /> {positionCardProps.amountUsd.toFixed(2)}
					</Typography>
					<Divider orientation="vertical" />
					<Typography fontWeight="md" lineHeight="28px">
						<Timer style={{ height: '28px', verticalAlign: 'bottom' }} /> {positionCardProps.durationInDays.toFixed(1)} days
					</Typography>
					<Divider orientation="vertical" />
					{positionCardProps.inRange && (
						<Chip size="sm" variant="solid" sx={{ '--Chip-radius': '5px', '--variant-solidBg': '#0AD85E' }}>
							IN RANGE
						</Chip>
					)}
					{!positionCardProps.inRange && (
						<Chip size="sm" variant="solid" sx={{ '--Chip-radius': '5px', '--variant-solidBg': '#FF2E60' }}>
							OUT OF RANGE
						</Chip>
					)}
				</CardContent>
			</CardOverflow>
			<CardContent>
				<Grid container spacing={2} sx={{ flexGrow: 1 }}>
					<Grid xs={4} display={'flex'} flexDirection={'column'}>
						<Item variant="soft">
							<Typography level="body-xs" fontWeight="lg">
								<Typography>Min price</Typography>
								<Typography sx={{ float: 'right' }}>Max price</Typography>
							</Typography>
							<Typography fontWeight="lg">
								<Typography>{positionCardProps.minPrice}</Typography>
								<Typography sx={{ float: 'right' }}>{positionCardProps.maxPrice}</Typography>
							</Typography>
						</Item>
						<Item variant="soft" style={{ display: 'flex' }}>
							<Tooltip
								title={'Current price: ' + positionCardProps.currentPrice + ' ' + positionCardProps.token1Symbol + '/' + positionCardProps.token0Symbol}
								variant="soft"
								size="lg"
								placement="bottom"
							>
								<div className="range-bar-cont">
									<div className="range-bar-bg"></div>
									<div className={positionCardProps.inRange ? 'range-bar-pos in-range-pos' : 'range-bar-pos out-range-pos'} style={{ left: '20%', width: '60%' }}></div>
									<div
										className="range-bar-price"
										style={{
											left: interpolateValue(positionCardProps.minPrice, positionCardProps.maxPrice, positionCardProps.currentPrice),
										}}
									></div>
								</div>
							</Tooltip>
						</Item>
					</Grid>
					<Grid xs={2}></Grid>
					<Grid xs={2}>
						<Item variant="soft">
							<Typography level="body-xs" fontWeight="lg">
								Total PNL
							</Typography>
							<Typography fontWeight="lg">
								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
								}).format(positionCardProps.pnlUsd)}
							</Typography>
						</Item>
					</Grid>
					<Grid xs={2}>
						<Item variant="soft">
							<Typography level="body-xs" fontWeight="lg">
								Total APR
							</Typography>
							<Typography fontWeight="lg">{(positionCardProps.apr * 100).toFixed(2)}%</Typography>
						</Item>
					</Grid>
					<Grid xs={2}>
						<Item variant="soft">
							<Typography level="body-xs" fontWeight="lg">
								Fee APR
							</Typography>
							<Typography fontWeight="lg">{(positionCardProps.feeApr * 100).toFixed(2)}%</Typography>
						</Item>
					</Grid>
				</Grid>
				<Divider />
				<Grid container spacing={2} sx={{ flexGrow: 1 }}>
					<Grid xs={4}></Grid>
					<Grid xs={2}></Grid>
					<Grid xs={2}>
						<Item variant="soft">
							<Typography level="body-xs" fontWeight="lg">
								Current assets
							</Typography>
							<Typography fontWeight="lg">
								{positionCardProps.amount0.toFixed(7)} {positionCardProps.token0Symbol}
							</Typography>
							<Typography fontWeight="lg">
								{positionCardProps.amount1.toFixed(7)} {positionCardProps.token1Symbol}
							</Typography>
						</Item>
					</Grid>
					<Grid xs={2}>
						<Item variant="soft">
							<Typography level="body-xs" fontWeight="lg">
								Invested assets
							</Typography>
							<Typography fontWeight="lg">
								{positionCardProps.depositedAmount0.toFixed(7)} {positionCardProps.token0Symbol}
							</Typography>
							<Typography fontWeight="lg">
								{positionCardProps.depositedAmount1.toFixed(7)} {positionCardProps.token1Symbol}
							</Typography>
						</Item>
					</Grid>
					<Grid xs={2}>
						<Item variant="soft">
							<Typography level="body-xs" fontWeight="lg">
								Total fees
							</Typography>
							<Typography fontWeight="lg">
								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
								}).format(positionCardProps.feesUsd)}
							</Typography>
						</Item>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}

export default PositionCard;
