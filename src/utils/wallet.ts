import { ethers } from "ethers";
import { NetworkType } from "./network";

export const getShortAddress = (address: string | null) =>
    address ? `${address.slice(0, 6)}...${address.slice(address.length - 3)}` : "";

export const isAddress = (address?: string) => address?.startsWith("0x") || address?.includes(".eth");

export const ensToAddress = async (chain: NetworkType, ens?: string) => {
    if (ens?.includes(".eth")) {
        const provider = new ethers.providers.InfuraProvider("homestead", process.env.REACT_APP_INFURA_KEY);
        return provider.resolveName(ens);
    }

    return ens;
};
