import axios from 'axios';

export interface Token {
	id: string;
	decimals: number;
	l2_token_address: string;
	name: string;
	sort_order: number;
	symbol: string;
	added_by_user: boolean;
	balance?: number;
	price?: number;
	logo?: string;
}

export const TOKENS: Array<Token> = [
	{
		id: 'wrapped-bitcoin',
		name: 'Wrapped BTC',
		symbol: 'WBTC',
		logo: '/images/tokens/wbtc.svg',
		decimals: 8,
		l2_token_address: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
		sort_order: -1,
		added_by_user: false,
	},
	{
		id: 'usd-coin',
		name: 'USD Coin',
		symbol: 'USDC',
		logo: '/images/tokens/usdc.svg',
		decimals: 6,
		l2_token_address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
		sort_order: 4,
		added_by_user: false,
	},
	{
		id: 'lusd',
		name: 'LUSD Stablecoin',
		symbol: 'LUSD',
		decimals: 18,
		logo: '/images/tokens/lusd.svg',
		l2_token_address: '0x070a76fd48ca0ef910631754d77dd822147fe98a569b826ec85e3c33fde586ac',
		sort_order: 3,
		added_by_user: false,
	},
	{
		id: 'tether',
		name: 'Tether USD',
		symbol: 'USDT',
		logo: '/images/tokens/usdt.svg',
		decimals: 6,
		l2_token_address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
		sort_order: 3,
		added_by_user: false,
	},
	{
		id: 'ethereum',
		name: 'Ether',
		symbol: 'ETH',
		logo: '/images/tokens/eth.svg',
		decimals: 18,
		l2_token_address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
		sort_order: 0,
		added_by_user: false,
	},
	{
		id: 'dai',
		name: 'DAI',
		symbol: 'DAI',
		logo: '/images/tokens/dai.svg',
		decimals: 18,
		l2_token_address: '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
		sort_order: 3,
		added_by_user: false,
	},
	{
		id: 'wrapped-steth',
		name: 'Wrapped liquid staked Ether 2.0',
		symbol: 'wstETH',
		logo: '/images/tokens/wsteth.svg',
		decimals: 18,
		l2_token_address: '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2',
		sort_order: 0,
		added_by_user: false,
	},
	{
		id: 'rocket-pool-eth',
		name: 'Rocket Pool ETH',
		symbol: 'rETH',
		logo: '/images/tokens/reth.svg',
		decimals: 18,
		l2_token_address: '0x0319111a5037cbec2b3e638cc34a3474e2d2608299f3e62866e9cc683208c610',
		sort_order: 0,
		added_by_user: false,
	},
	{
		id: 'lords',
		name: 'LORDS',
		symbol: 'LORDS',
		logo: '/images/tokens/lords.svg',
		decimals: 18,
		l2_token_address: '0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49',
		sort_order: 2,
		added_by_user: false,
	},
	/*
	{
		id: 'r',
		name: 'R Stablecoin',
		symbol: 'R',
		decimals: 18,
		l2_token_address: '0x01fa2fb85f624600112040e1f3a848f53a37ed5a7385810063d5fe6887280333',
		sort_order: 3,
	},
	{
		id: 'frax',
		name: 'Frax',
		symbol: 'FRAX',
		decimals: 18,
		l2_token_address: '0x009c6b4fb13dfaa025c1383ed6190af8ed8cbb09d9588a3bb020feb152442406',
		sort_order: 2,
	},
	{
		id: 'frax-share',
		name: 'Frax Share',
		symbol: 'FXS',
		decimals: 18,
		l2_token_address: '0x0058efd0e73c33a848ffaa88738d128ebf0af98ea78cf3c14dc757bb02d39ffb',
		sort_order: 2,
	},
	{
		id: 'staked-frax-ether',
		name: 'Staked Frax Ether',
		symbol: 'sfrxETH',
		decimals: 18,
		l2_token_address: '0x04578fffc279e61b5cb0267a5f8e24b6089d40f93158fbbad2cb23b8622c9233',
		sort_order: 2,
	},
	*/
	{
		id: 'unicorn-token',
		name: 'Uniswap',
		symbol: 'UNI',
		logo: '/images/tokens/uniswap.png',
		decimals: 18,
		l2_token_address: '0x049210ffc442172463f3177147c1aeaa36c51d152c1b0630f2364c300d4f48ee',
		sort_order: 2,
		added_by_user: false,
	},
	{
		id: 'akamaru',
		name: 'Akamaru',
		symbol: 'AKU',
		logo: '/images/tokens/akamaru.png',
		decimals: 18,
		l2_token_address: '0x137dfca7d96cdd526d13a63176454f35c691f55837497448fad352643cfe4d4',
		sort_order: 2,
		added_by_user: false,
	},
	{
		id: 'stark-inu',
		name: 'Stark Inu',
		symbol: 'STARKINU',
		logo: '/images/tokens/stark-inu.png',
		decimals: 18,
		l2_token_address: '0x6cead2351c6fc93ccf3a43d4ddb645d0c851c1827b0332e3ac0c5c89d6560db',
		sort_order: 2,
		added_by_user: false,
	},
];

export const fetchTokensPrice = async (): Promise<void> => {
	const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${TOKENS.map((token) => token.id).join(',')}&vs_currencies=usd`);
	TOKENS.forEach((token) => {
		token.price = response.data[token.id]?.usd;
	});
	return;
};
