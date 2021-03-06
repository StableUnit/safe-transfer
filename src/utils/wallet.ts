import { ethers } from "ethers";

export const NETWORK_TYPE = "matic";
export const NETWORK_TYPE_CODE = 137;

export const getShortAddress = (address: string | null) =>
    address ? `${address.slice(0, 6)}...${address.slice(address.length - 3)}` : "";

export const isAddress = (address?: string) => address?.startsWith("0x") || address?.includes(".eth");

export const ensToAddress = async (ens?: string) =>
    ens?.includes(".eth") ? ethers.providers.getDefaultProvider().resolveName(ens) : ens;
