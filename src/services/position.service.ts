import { PositionCardDto } from '../dto/position-card.dto';

export const getPositionsExplore = async (): Promise<Array<PositionCardDto>> => {
	return fetch(`${process.env.REACT_APP_OCTOPUS_API_URL}position/explore`).then((res) => res.json());
};

export const getPositionsByAddress = async (address: string): Promise<Array<PositionCardDto>> => {
	return fetch(`${process.env.REACT_APP_OCTOPUS_API_URL}position/address/${address}`).then((res) => res.json());
};
