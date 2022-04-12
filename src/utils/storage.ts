import { TokenMetadataType } from "./tokens";

const CUSTOM_TOKENS_KEY = "custom-tokens-key";

export const getTokens: () => TokenMetadataType[] = () => {
    const tokensStr = localStorage.getItem(CUSTOM_TOKENS_KEY);
    return tokensStr ? JSON.parse(tokensStr) : [];
};

export const addToken = (token: TokenMetadataType) => {
    const tokens = getTokens();
    const newTokens = [...tokens, token];
    localStorage.setItem(CUSTOM_TOKENS_KEY, JSON.stringify(newTokens));
};
