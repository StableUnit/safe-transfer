import { ethers } from "ethers";
// @ts-ignore
import AVVY from "@avvy/client";
import Web3 from "web3";
import { PROVIDER_URL_AVVY } from "./network";

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

export const avvyToAddress = async (avax?: string | null) => {
    if (avax?.includes(".avax")) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL_AVVY);
            const avvy = new AVVY(provider);
            return avvy.name(avax).resolve(AVVY.RECORDS.EVM);
        } catch (e) {
            return undefined;
        }
    }

    return avax;
};

export const addressToAvvy = async (address?: string | null) => {
    if (address && Web3.utils.isAddress(address)) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL_AVVY);
            const avvy = new AVVY(provider);
            const hash = await avvy.reverse(AVVY.RECORDS.EVM, address);
            const name = await hash.lookup();
            return name.name;
        } catch (e) {
            return undefined;
        }
    }

    return address;
};
