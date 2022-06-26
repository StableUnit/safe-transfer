import BN from "bn.js";
import Moralis from "moralis";
import { CustomNetworkType } from "./network";
import { customWeb3s } from "../components/App/App";
import CONTRACT_ERC20 from "../contracts/ERC20.json";

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
}
export const CUSTOM_TOKENS: Record<CustomNetworkType, TokenInfo[]> = {
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

export const getCustomTokenAllowance = async (chain: CustomNetworkType, address: string, from: string, to: string) => {
    const tokenContract = new customWeb3s[chain].eth.Contract(CONTRACT_ERC20 as any, address);
    const allowance = await tokenContract.methods.allowance(from, to).call();
    return allowance;
};

export const getCustomTokenMetadata = async (chain: CustomNetworkType, address: string, account?: string) => {
    const tokenContract = new customWeb3s[chain].eth.Contract(CONTRACT_ERC20 as any, address);
    const balance = account ? await tokenContract.methods.balanceOf(account).call() : undefined;

    return {
        address,
        balance,
        name: await tokenContract.methods.name().call(),
        symbol: await tokenContract.methods.symbol().call(),
        decimals: await tokenContract.methods.decimals().call(),
    };
};

export const getTokenContractFactory = (web3: Moralis.MoralisWeb3Provider | null) => (address: string) => {
    const ethers = Moralis.web3Library;
    // @ts-ignore
    return new ethers.Contract(address, CONTRACT_ERC20, web3?.getSigner());
};
