import axios from "axios";
import { NetworkType } from "./network";

export const getBitCoinType = (network: NetworkType) => {
    switch (network) {
        case "eth":
            return "60";
        case "bsc":
            return "9006";
        case "polygon":
            return "966";
        default:
            return "60";
    }
};
export const HOST = "https://indexer-v1.did.id";
export const GET_NAME_URL = "/v1/reverse/record";
export const GET_ADDRESS_URL = "/v1/account/info";

export const addressToBit = async (network: NetworkType, address?: string | null) => {
    const coinType = getBitCoinType(network);
    if (!coinType || !address) {
        return undefined;
    }
    const res = await axios.post(`${HOST}${GET_NAME_URL}`, {
        type: "blockchain",
        key_info: { coin_type: coinType, key: address },
    });
    return res.data?.data?.account;
};

export const bitToAddress = async (network: NetworkType, account: string) => {
    const coinType = getBitCoinType(network);
    if (!coinType) {
        return undefined;
    }
    const res = await axios.post(`${HOST}${GET_ADDRESS_URL}`, { account });
    return res.data?.data?.account_info?.owner_key;
};
