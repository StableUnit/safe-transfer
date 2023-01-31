import { ethers } from "ethers";
import { networkInfo, NetworkType } from "./network";

export const NETWORK_TYPE = "matic";
export const NETWORK_TYPE_CODE = 137;

export const getShortAddress = (address: string | null) =>
    address ? `${address.slice(0, 6)}...${address.slice(address.length - 3)}` : "";

export const isAddress = (address?: string) => address?.startsWith("0x") || address?.includes(".eth");

export const ensToAddress = async (chain: NetworkType, ens?: string) => {
    if (ens?.includes(".eth")) {
        const rpc = networkInfo[chain].rpcUrls[0];
        return ethers.providers.getDefaultProvider(rpc).resolveName(ens);
    }

    return ens;
};
