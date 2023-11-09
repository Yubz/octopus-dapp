import { TokenPrice } from "../models/ekubo/api";

export interface Token {
  decimals: number;
  l2_token_address: string;
  name: string;
  sort_order: number;
  symbol: string;
  price: TokenPrice;
}

export const getTokens = async (): Promise<Array<Token>> => {
  const tokens = await fetch("https://mainnet-api.ekubo.org/tokens").then(
    (res) => res.json()
  );
  tokens.forEach(async (token: Token) => {
    token.price = await getTokenPriceUsd(token.l2_token_address);
  });
  return tokens;
};

export const getTokenPriceUsd = async (
  address: string
): Promise<TokenPrice> => {
  return await fetch(
    "https://mainnet-api.ekubo.org/price/" +
      address +
      "/0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"
  ).then((res) => res.json());
};
