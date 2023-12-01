export interface PositionInfoDto {
	id: string;
	feesUsd: number;
	amountUsd: number;
	pnlUsd: number;
	apr: number;
	feeApr: number;
	inRange: boolean;
	durationInDays: number;
}
