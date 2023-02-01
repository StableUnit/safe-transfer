import { ethers } from "ethers";
import Web3 from "web3";
import { networkInfo, networkToId, NetworkType } from "./network";
import { rpcList } from "./rpc";

export const NETWORK_TYPE = "matic";
export const NETWORK_TYPE_CODE = 137;

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
