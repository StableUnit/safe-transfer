import { TokenMetadataType } from "./tokens";

const CUSTOM_TOKENS_KEY = "custom-tokens-key";

export const getTokens: () => (TokenMetadataType & { chainId: number })[] = () => {
    const tokensStr = localStorage.getItem(CUSTOM_TOKENS_KEY);
    return tokensStr ? JSON.parse(tokensStr) : [];
};

export const addToken = (token: TokenMetadataType, chainId: number) => {
    const tokens = getTokens();
    const newTokens = [...tokens, { ...token, chainId }];
    localStorage.setItem(CUSTOM_TOKENS_KEY, JSON.stringify(newTokens));
};
