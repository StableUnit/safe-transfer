export const NETWORK_TYPE = "matic";
export const NETWORK_TYPE_CODE = 137;

export const getShortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
