import { ethers } from "ethers";
import Web3 from "web3";

export const getShortAddress = (address: string | null) =>
    address ? `${address.slice(0, 6)}...${address.slice(address.length - 3)}` : "";

export const isAddress = (address?: string) => address?.startsWith("0x") || address?.includes(".eth");

export const ensToAddress = async (ens?: string) => {
    if (ens?.includes(".eth")) {
        const provider = new ethers.providers.InfuraProvider("homestead", process.env.REACT_APP_INFURA_KEY);
        return provider.resolveName(ens);
    }

    return ens;
};

export const addressToEns = async (ens?: string) => {
    if (ens && Web3.utils.isAddress(ens)) {
        const provider = new ethers.providers.InfuraProvider("homestead", process.env.REACT_APP_INFURA_KEY);
        return provider.lookupAddress(ens);
    }

    return ens;
};
