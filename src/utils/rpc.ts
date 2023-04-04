import Web3 from "web3";
import { NETWORK, networkInfo, NetworkType } from "./network";

const createWeb3Provider = (name: NetworkType) => {
    return new Web3(new Web3.providers.HttpProvider(networkInfo[NETWORK[name]].rpcUrls[0]));
};

const createRPC = (names: NetworkType[]) =>
    names.reduce(
        (acc, name) => ({
            ...acc,
            [name]: createWeb3Provider(name),
        }),
        {} as Record<NetworkType, Web3>
    );

export const rpcList = createRPC([
    "eth",
    "goerli",
    "polygon",
    "bsc",
    "fantom",
    "avalanche",
    "aurora",
    "optimism",
    "harmony",
    "boba",
    "cronos",
    "celo",
    "okxchain",
    "gnosis",
    "zkSync",
]);
