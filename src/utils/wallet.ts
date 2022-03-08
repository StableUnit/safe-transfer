export const NETWORK_TYPE = "matic";
export const NETWORK_TYPE_CODE = 137;

export const getShortAddress = (address: string | null) =>
    address ? `${address.slice(0, 6)}...${address.slice(address.length - 4)}` : "";

export const isAddress = (address?: string) => !!address?.startsWith("0x");
