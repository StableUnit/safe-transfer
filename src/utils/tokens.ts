import BN from "bn.js";
import Web3 from "web3";

import { networkToId, NetworkType } from "./network";
import CONTRACT_ERC20 from "../contracts/ERC20.json";
import TOKEN_LIST from "../contracts/tokenlist.json";
import { rpcList } from "./rpc";

export type TokenMetadataType = {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    balance?: string;
    logo?: string | undefined;
    // eslint-disable-next-line camelcase
    logo_hash?: string | undefined;
    thumbnail?: string | undefined;
    // eslint-disable-next-line camelcase
    block_number?: string | undefined;
    validated?: string | undefined;
};

interface TokenInfo {
    id: string;
    symbol: string;
    address: string;
    decimals?: string;
}
export const CUSTOM_TOKENS: Record<NetworkType, TokenInfo[]> = {
    eth: [],
    goerli: [],
    polygon: [],
    bsc: [],
    fantom: [],
    avalanche: [],
    celo: [
        {
            id: "tether",
            symbol: "USDT",
            address: "0x617f3112bf5397d0467d315cc709ef968d9ba546",
        },
        {
            id: "usdc",
            symbol: "USDC",
            address: "0xef4229c8c3250c675f21bcefa42f58efbff6002a",
        },
        {
            id: "usdc-wormhole",
            symbol: "USDC(Wormhole)",
            address: "0x37f750b7cc259a2f741af45294f6a16572cf5cad",
        },
        {
            id: "wbtc",
            symbol: "WBTC",
            address: "0xd629eb00deced2a080b7ec630ef6ac117e614f1b",
        },
        {
            id: "celo",
            symbol: "CELO",
            address: "0x471ece3750da237f93b8e339c536989b8978a438",
        },
        {
            id: "sushi",
            symbol: "SUSHI",
            address: "0x29dfce9c22003a4999930382fd00f9fd6133acd1",
        },
    ],
    aurora: [
        {
            id: "tether",
            symbol: "USDT",
            address: "0x4988a896b1227218e4a686fde5eabdcabd91571f",
        },
        {
            id: "dai",
            symbol: "DAI",
            address: "0xe3520349f477a5f6eb06107066048508498a291b",
        },
        {
            id: "usdc",
            symbol: "USDC",
            address: "0xb12bfca5a55806aaf64e99521918a4bf0fc40802",
        },
        {
            id: "Aurora",
            symbol: "AURORA",
            address: "0x8bec47865ade3b172a928df8f990bc7f2a3b9f79",
        },
        {
            id: "Chronicle",
            symbol: "XNL",
            address: "0x7ca1c28663b76cfde424a9494555b94846205585",
        },
        {
            id: "WannaSwap",
            symbol: "WANNA",
            address: "0x7faa64faf54750a2e3ee621166635feaf406ab22",
        },
    ],
    harmony: [
        {
            id: "dai",
            symbol: "1DAI",
            address: "0xEf977d2f931C1978Db5F6747666fa1eACB0d0339",
        },
        {
            id: "busd",
            symbol: "BUSD",
            address: "0xE176EBE47d621b984a73036B9DA5d834411ef734",
        },
        {
            id: "aave",
            symbol: "1AAVE",
            address: "0xcf323aad9e522b93f11c352caa519ad0e14eb40f",
        },
        {
            id: "matic",
            symbol: "1MATIC",
            address: "0x301259f392b551ca8c592c9f676fcd2f9a0a84c5",
        },
        {
            id: "usdc",
            symbol: "1USDC",
            address: "0x301259f392b551ca8c592c9f676fcd2f9a0a84c5",
        },
    ],
    optimism: [
        {
            id: "link",
            symbol: "LINK",
            address: "0x4911b761993b9c8c0d14ba2d86902af6b0074f5b",
        },
    ],
    boba: [],
    cronos: [],
};

export const beautifyTokenBalance = (balance: string, decimals: number, fraction = 5) => {
    const exp = 10 ** fraction;

    return (+balance.slice(0, -decimals + fraction) / exp).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: fraction,
    });
};

export const fromHRToBN = (n: number, decimals: number) => {
    const MAX_SMALL_DECIMAL = 6;
    if (decimals <= MAX_SMALL_DECIMAL) {
        return new BN(10).pow(new BN(decimals)).muln(n);
    }

    const multiplierSmall = new BN(10).pow(new BN(MAX_SMALL_DECIMAL));
    const multiplierMain = new BN(10).pow(new BN(decimals - MAX_SMALL_DECIMAL));

    return multiplierSmall.muln(n).mul(multiplierMain);
};

export const toHRNumber = (bn: BN, decimal = 0) => bn.div(new BN(10).pow(new BN(decimal))).toNumber();
export const toHRNumberFloat = (bn: BN, decimal = 0) => toHRNumber(bn.muln(1000), decimal) / 1000;

export const getCustomTokenAllowance = async (chain: NetworkType, address: string, from: string, to: string) => {
    const tokenContract = new rpcList[chain].eth.Contract(CONTRACT_ERC20 as any, address);
    const allowance = await tokenContract.methods.allowance(from, to).call();
    return allowance;
};

export const getCustomTokenMetadata = async (chain: NetworkType, address: string, account?: string) => {
    const tokenContract = new rpcList[chain].eth.Contract(CONTRACT_ERC20 as any, address);
    const balance = account ? await tokenContract.methods.balanceOf(account).call() : undefined;

    return {
        address,
        balance,
        name: await tokenContract.methods.name().call(),
        symbol: await tokenContract.methods.symbol().call(),
        decimals: await tokenContract.methods.decimals().call(),
        // @ts-ignore
        logo: TOKEN_LIST[networkToId[chain]]?.find((v: any) => v.address?.toLowerCase() === address?.toLowerCase())
            ?.logoURI,
    };
};

export const getCovalentUrl = (chainId: number, address: string) =>
    // eslint-disable-next-line max-len
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=true&key=${process.env.REACT_APP_COVALENT_KEY}`;

// export const nativeTokensAddresses = {
//     [NETWORK.eth]: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
//     [NETWORK.goerli]: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
//     [NETWORK.bsc]: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
//     [NETWORK.polygon]: "0x0000000000000000000000000000000000001010",
// };

export const nativeTokensAddresses = [
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "0x0000000000000000000000000000000000001010",
    "0x000000000000000000000000000000000000dead",
    "0x0000000000000000000000000000000000000000",
];
