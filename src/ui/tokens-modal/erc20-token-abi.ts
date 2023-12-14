export const ERC20_TOKEN_ABI = [
	{
		type: 'impl',
		name: 'ERC20Impl',
		interface_name: 'openzeppelin::token::erc20::interface::IERC20',
	},
	{
		type: 'struct',
		name: 'core::integer::u256',
		members: [
			{
				name: 'low',
				type: 'core::integer::u128',
			},
			{
				name: 'high',
				type: 'core::integer::u128',
			},
		],
	},
	{
		type: 'enum',
		name: 'core::bool',
		variants: [
			{
				name: 'False',
				type: '()',
			},
			{
				name: 'True',
				type: '()',
			},
		],
	},
	{
		type: 'interface',
		name: 'openzeppelin::token::erc20::interface::IERC20',
		items: [
			{
				type: 'function',
				name: 'name',
				inputs: [],
				outputs: [
					{
						type: 'core::felt252',
					},
				],
				state_mutability: 'view',
			},
			{
				type: 'function',
				name: 'symbol',
				inputs: [],
				outputs: [
					{
						type: 'core::felt252',
					},
				],
				state_mutability: 'view',
			},
			{
				type: 'function',
				name: 'decimals',
				inputs: [],
				outputs: [
					{
						type: 'core::integer::u8',
					},
				],
				state_mutability: 'view',
			},
			{
				type: 'function',
				name: 'total_supply',
				inputs: [],
				outputs: [
					{
						type: 'core::integer::u256',
					},
				],
				state_mutability: 'view',
			},
			{
				type: 'function',
				name: 'balance_of',
				inputs: [
					{
						name: 'account',
						type: 'core::starknet::contract_address::ContractAddress',
					},
				],
				outputs: [
					{
						type: 'core::integer::u256',
					},
				],
				state_mutability: 'view',
			},
			{
				type: 'function',
				name: 'allowance',
				inputs: [
					{
						name: 'owner',
						type: 'core::starknet::contract_address::ContractAddress',
					},
					{
						name: 'spender',
						type: 'core::starknet::contract_address::ContractAddress',
					},
				],
				outputs: [
					{
						type: 'core::integer::u256',
					},
				],
				state_mutability: 'view',
			},
			{
				type: 'function',
				name: 'transfer',
				inputs: [
					{
						name: 'recipient',
						type: 'core::starknet::contract_address::ContractAddress',
					},
					{
						name: 'amount',
						type: 'core::integer::u256',
					},
				],
				outputs: [
					{
						type: 'core::bool',
					},
				],
				state_mutability: 'external',
			},
			{
				type: 'function',
				name: 'transfer_from',
				inputs: [
					{
						name: 'sender',
						type: 'core::starknet::contract_address::ContractAddress',
					},
					{
						name: 'recipient',
						type: 'core::starknet::contract_address::ContractAddress',
					},
					{
						name: 'amount',
						type: 'core::integer::u256',
					},
				],
				outputs: [
					{
						type: 'core::bool',
					},
				],
				state_mutability: 'external',
			},
			{
				type: 'function',
				name: 'approve',
				inputs: [
					{
						name: 'spender',
						type: 'core::starknet::contract_address::ContractAddress',
					},
					{
						name: 'amount',
						type: 'core::integer::u256',
					},
				],
				outputs: [
					{
						type: 'core::bool',
					},
				],
				state_mutability: 'external',
			},
		],
	},
	{
		type: 'impl',
		name: 'ERC20CamelOnlyImpl',
		interface_name: 'openzeppelin::token::erc20::interface::IERC20CamelOnly',
	},
	{
		type: 'interface',
		name: 'openzeppelin::token::erc20::interface::IERC20CamelOnly',
		items: [
			{
				type: 'function',
				name: 'totalSupply',
				inputs: [],
				outputs: [
					{
						type: 'core::integer::u256',
					},
				],
				state_mutability: 'view',
			},
			{
				type: 'function',
				name: 'balanceOf',
				inputs: [
					{
						name: 'account',
						type: 'core::starknet::contract_address::ContractAddress',
					},
				],
				outputs: [
					{
						type: 'core::integer::u256',
					},
				],
				state_mutability: 'view',
			},
			{
				type: 'function',
				name: 'transferFrom',
				inputs: [
					{
						name: 'sender',
						type: 'core::starknet::contract_address::ContractAddress',
					},
					{
						name: 'recipient',
						type: 'core::starknet::contract_address::ContractAddress',
					},
					{
						name: 'amount',
						type: 'core::integer::u256',
					},
				],
				outputs: [
					{
						type: 'core::bool',
					},
				],
				state_mutability: 'external',
			},
		],
	},
	{
		type: 'constructor',
		name: 'constructor',
		inputs: [
			{
				name: 'name',
				type: 'core::felt252',
			},
			{
				name: 'symbol',
				type: 'core::felt252',
			},
			{
				name: 'initial_supply',
				type: 'core::integer::u256',
			},
			{
				name: 'recipient',
				type: 'core::starknet::contract_address::ContractAddress',
			},
		],
	},
	{
		type: 'function',
		name: 'increase_allowance',
		inputs: [
			{
				name: 'spender',
				type: 'core::starknet::contract_address::ContractAddress',
			},
			{
				name: 'added_value',
				type: 'core::integer::u256',
			},
		],
		outputs: [
			{
				type: 'core::bool',
			},
		],
		state_mutability: 'external',
	},
	{
		type: 'function',
		name: 'decrease_allowance',
		inputs: [
			{
				name: 'spender',
				type: 'core::starknet::contract_address::ContractAddress',
			},
			{
				name: 'subtracted_value',
				type: 'core::integer::u256',
			},
		],
		outputs: [
			{
				type: 'core::bool',
			},
		],
		state_mutability: 'external',
	},
	{
		type: 'function',
		name: 'increaseAllowance',
		inputs: [
			{
				name: 'spender',
				type: 'core::starknet::contract_address::ContractAddress',
			},
			{
				name: 'addedValue',
				type: 'core::integer::u256',
			},
		],
		outputs: [
			{
				type: 'core::bool',
			},
		],
		state_mutability: 'external',
	},
	{
		type: 'function',
		name: 'decreaseAllowance',
		inputs: [
			{
				name: 'spender',
				type: 'core::starknet::contract_address::ContractAddress',
			},
			{
				name: 'subtractedValue',
				type: 'core::integer::u256',
			},
		],
		outputs: [
			{
				type: 'core::bool',
			},
		],
		state_mutability: 'external',
	},
	{
		type: 'event',
		name: 'akamaru::Contracts::Token::Token::Transfer',
		kind: 'struct',
		members: [
			{
				name: 'from',
				type: 'core::starknet::contract_address::ContractAddress',
				kind: 'key',
			},
			{
				name: 'to',
				type: 'core::starknet::contract_address::ContractAddress',
				kind: 'key',
			},
			{
				name: 'value',
				type: 'core::integer::u256',
				kind: 'data',
			},
		],
	},
	{
		type: 'event',
		name: 'akamaru::Contracts::Token::Token::Approval',
		kind: 'struct',
		members: [
			{
				name: 'owner',
				type: 'core::starknet::contract_address::ContractAddress',
				kind: 'key',
			},
			{
				name: 'spender',
				type: 'core::starknet::contract_address::ContractAddress',
				kind: 'key',
			},
			{
				name: 'value',
				type: 'core::integer::u256',
				kind: 'data',
			},
		],
	},
	{
		type: 'event',
		name: 'akamaru::Contracts::Token::Token::Event',
		kind: 'enum',
		variants: [
			{
				name: 'Transfer',
				type: 'akamaru::Contracts::Token::Token::Transfer',
				kind: 'nested',
			},
			{
				name: 'Approval',
				type: 'akamaru::Contracts::Token::Token::Approval',
				kind: 'nested',
			},
		],
	},
];
