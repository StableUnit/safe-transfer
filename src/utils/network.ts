import Web3 from "web3";

export type NetworkType =
    | "eth"
    | "rinkeby"
    | "polygon"
    | "bsc"
    | "fantom"
    | "avalanche"
    | "aurora"
    | "harmony"
    | "optimism"
    | "boba"
    | "skale"
    | "cronos";

export const NETWORK: Record<NetworkType, NetworkType> = {
    eth: "eth",
    rinkeby: "rinkeby",
    polygon: "polygon",
    aurora: "aurora",
    harmony: "harmony",
    // arbitrum: "arbitrum",
    optimism: "optimism",
    boba: "boba",
    skale: "skale",
    cronos: "cronos",
    bsc: "bsc",
    fantom: "fantom",
    avalanche: "avalanche",
};

export const networkNames = {
    [NETWORK.eth]: "Ethereum",
    [NETWORK.polygon]: "Polygon",
    [NETWORK.rinkeby]: "Rinkeby",
    [NETWORK.aurora]: "Aurora",
    [NETWORK.harmony]: "Harmony",
    // [NETWORK.arbitrum]: "Arbitrum",
    [NETWORK.optimism]: "Optimism",
    [NETWORK.boba]: "Boba",
    [NETWORK.skale]: "Skale",
    [NETWORK.cronos]: "Cronos",
    [NETWORK.bsc]: "Binance Smart Chain",
    [NETWORK.fantom]: "Fantom",
    [NETWORK.avalanche]: "Avalanche",
};

const inverse = (obj: Record<any, any>) => Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));

export const idToNetwork: Record<number, NetworkType> = {
    1: NETWORK.eth,
    4: NETWORK.rinkeby,
    // 10: NETWORK.optimism, // mainnet
    25: NETWORK.cronos, // mainnet
    28: NETWORK.boba, // testnet
    56: NETWORK.bsc,
    69: NETWORK.optimism, // testnet
    137: NETWORK.polygon,
    250: NETWORK.fantom,
    // 288: NETWORK.boba, // mainnet
    // 338: NETWORK.cronos, // testnet
    // 42161: NETWORK.arbitrum,
    43114: NETWORK.avalanche,
    1085866509: NETWORK.skale, // hackathon chainID
    1313161554: NETWORK.aurora,
    // 1313161555: NETWORK.aurora, // testnet
    1666600000: NETWORK.harmony,
    // 1666700000: NETWORK.harmony, // testnet
};

export const networkToId = inverse(idToNetwork);

export const networkInfo = {
    [NETWORK.eth]: {
        chainName: "Ethereum Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.eth]),
        blockExplorerUrls: ["https://etherscan.io"],
        rpcUrls: ["https://rpc.ankr.com/eth"],
    },
    [NETWORK.rinkeby]: {
        chainName: "Rinkeby",
        chainId: Web3.utils.toHex(networkToId[NETWORK.rinkeby]),
        blockExplorerUrls: ["https://rinkeby.etherscan.io"],
        rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    },
    // mainnet
    // [NETWORK.optimism]: {
    //     chainName: "Optimism",
    //     chainId: Web3.utils.toHex(networkToId[NETWORK.optimism]),
    //     rpcUrls: ["https://mainnet.optimism.io/"],
    //     blockExplorerUrls: ["https://optimistic.etherscan.io"],
    //     nativeCurrency: {
    //         name: "KOR",
    //         symbol: "KOR",
    //         decimals: 18,
    //     },
    // },
    // testnet
    [NETWORK.optimism]: {
        chainName: "Optimism",
        chainId: Web3.utils.toHex(networkToId[NETWORK.optimism]),
        rpcUrls: ["https://kovan.optimism.io/"],
        blockExplorerUrls: ["https://kovan-optimistic.etherscan.io/"],
        nativeCurrency: {
            name: "KOR",
            symbol: "KOR",
            decimals: 18,
        },
    },
    // mainnet
    // [NETWORK.boba]: {
    //     chainName: "Boba",
    //     chainId: Web3.utils.toHex(networkToId[NETWORK.boba]),
    //     rpcUrls: ["https://mainnet.boba.network"],
    //     blockExplorerUrls: ["https://blockexplorer.boba.network/"],
    //     nativeCurrency: {
    //         name: "ETH",
    //         symbol: "ETH",
    //         decimals: 18,
    //     },
    // },
    // testnet
    [NETWORK.boba]: {
        chainName: "Boba",
        chainId: Web3.utils.toHex(networkToId[NETWORK.boba]),
        rpcUrls: ["https://rinkeby.boba.network/"],
        blockExplorerUrls: ["https://blockexplorer.rinkeby.boba.network/"],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
    },
    [NETWORK.skale]: {
        chainName: "Hackathon Skale Chain| downright-royal-saiph",
        chainId: Web3.utils.toHex(networkToId[NETWORK.skale]),
        rpcUrls: ["https://hackathon.skalenodes.com/v1/downright-royal-saiph"],
        blockExplorerUrls: ["https://downright-royal-saiph.explorer.hackathon.skalenodes.com/"],
        nativeCurrency: {
            name: "sFUEL",
            symbol: "sFUEL",
            decimals: 18,
        },
    },
    // mainnet
    [NETWORK.cronos]: {
        chainName: "Cronos",
        chainId: Web3.utils.toHex(networkToId[NETWORK.cronos]),
        rpcUrls: ["https://evm.cronos.org"],
        blockExplorerUrls: ["https://cronoscan.com/"],
        nativeCurrency: {
            name: "CRO",
            symbol: "CRO",
            decimals: 18,
        },
    },
    // testnet
    // [NETWORK.cronos]: {
    //     chainName: "Cronos Testnet",
    //     chainId: Web3.utils.toHex(networkToId[NETWORK.cronos]),
    //     rpcUrls: ["https://evm-t3.cronos.org"],
    //     blockExplorerUrls: ["https://testnet.cronoscan.com/"],
    //     nativeCurrency: {
    //         name: "tCRO",
    //         symbol: "tCRO",
    //         decimals: 18,
    //     },
    // },
    [NETWORK.bsc]: {
        chainName: "Binance Smart Chain Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.bsc]),
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com"],
        nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
        },
    },
    [NETWORK.polygon]: {
        chainName: "Polygon Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.polygon]),
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
        nativeCurrency: {
            name: "MATIC Token",
            symbol: "MATIC Token",
            decimals: 18,
        },
    },
    [NETWORK.fantom]: {
        chainName: "Fantom Opera",
        chainId: Web3.utils.toHex(networkToId[NETWORK.fantom]),
        rpcUrls: ["https://rpc.ftm.tools/"],
        blockExplorerUrls: ["https://ftmscan.com"],
        nativeCurrency: {
            name: "FTM",
            symbol: "FTM",
            decimals: 18,
        },
    },
    // [NETWORK.arbitrum]: {
    //     chainName: "Arbitrum One",
    //     chainId: Web3.utils.toHex(networkToId[NETWORK.arbitrum]),
    //     rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    //     blockExplorerUrls: ["https://arbiscan.io"],
    //     nativeCurrency: {
    //         name: "ETH",
    //         symbol: "ETH",
    //         decimals: 18,
    //     },
    // },
    [NETWORK.avalanche]: {
        chainName: "Avalanche C-Chain",
        chainId: Web3.utils.toHex(networkToId[NETWORK.avalanche]),
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io"],
        nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18,
        },
    },
    [NETWORK.aurora]: {
        chainName: "Aurora Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.aurora]),
        rpcUrls: ["https://mainnet.aurora.dev"],
        blockExplorerUrls: ["https://aurorascan.dev"],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
    },
    [NETWORK.harmony]: {
        chainName: "Harmony Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.harmony]),
        rpcUrls: ["https://api.harmony.one"],
        blockExplorerUrls: ["https://explorer.harmony.one/"],
        nativeCurrency: {
            name: "ONE",
            symbol: "ONE",
            decimals: 18,
        },
    },
};

export const changeNetworkAtMetamask = async (networkName: number) => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: Web3.utils.toHex(networkToId[networkName]) }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        // @ts-ignore
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [networkInfo[networkName]],
                });
            } catch (addError) {
                console.error(addError);
            }
        }
    }
};

export const getTrxHashLink = (hash: string, chain: NetworkType) =>
    `${networkInfo[chain].blockExplorerUrls}/tx/${hash}`;

export const getAddressLink = (address: string, chain: NetworkType) =>
    `${networkInfo[chain].blockExplorerUrls}/token/${address}`;
