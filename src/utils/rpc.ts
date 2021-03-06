import Web3 from "web3";
import { NETWORK, networkInfo, NetworkType } from "./network";

const createWeb3Provider = (name: NetworkType) =>
    new Web3(new Web3.providers.HttpProvider(networkInfo[NETWORK[name]].rpcUrls[0]));

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
    "rinkeby",
    "polygon",
    "bsc",
    "fantom",
    "avalanche",
    "aurora",
    "optimism",
    "harmony",
    "boba",
    "skale",
    "cronos",
]);
