import Web3 from "web3";
import { Chain } from "wagmi";

export type NetworkType =
    | "eth"
    | "goerli"
    | "polygon"
    | "bsc"
    | "fantom"
    | "avalanche"
    | "aurora"
    | "harmony"
    | "optimism"
    | "boba"
    | "celo"
    | "okxchain"
    | "gnosis"
    | "zkSync"
    // | "skale"
    | "cronos";

export const NETWORK: Record<NetworkType, NetworkType> = {
    eth: "eth",
    goerli: "goerli",
    polygon: "polygon",
    aurora: "aurora",
    harmony: "harmony",
    // arbitrum: "arbitrum",
    optimism: "optimism",
    boba: "boba",
    // skale: "skale",
    cronos: "cronos",
    bsc: "bsc",
    fantom: "fantom",
    avalanche: "avalanche",
    celo: "celo",
    okxchain: "okxchain",
    gnosis: "gnosis",
    zkSync: "zkSync",
};

export const networkNames = {
    [NETWORK.eth]: "Ethereum",
    [NETWORK.avalanche]: "Avalanche",
    [NETWORK.bsc]: "Binance Smart Chain",
    [NETWORK.polygon]: "Polygon",
    [NETWORK.goerli]: "Goerli",
    [NETWORK.fantom]: "Fantom",
    [NETWORK.optimism]: "Optimism",
    [NETWORK.aurora]: "Aurora",
    [NETWORK.harmony]: "Harmony",
    // [NETWORK.arbitrum]: "Arbitrum",
    [NETWORK.boba]: "Boba",
    // [NETWORK.skale]: "Skale",
    [NETWORK.cronos]: "Cronos",
    [NETWORK.celo]: "Celo",
    [NETWORK.okxchain]: "OKXChain",
    [NETWORK.gnosis]: "Gnosis",
    [NETWORK.zkSync]: "ZkSync Era Mainnet",
};

const inverse = (obj: Record<any, any>) => Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));

export const idToNetwork: Record<number, NetworkType> = {
    1: NETWORK.eth,
    5: NETWORK.goerli,
    10: NETWORK.optimism, // mainnet
    25: NETWORK.cronos, // mainnet
    // 28: NETWORK.boba, // testnet
    56: NETWORK.bsc,
    66: NETWORK.okxchain,
    100: NETWORK.gnosis,
    // 69: NETWORK.optimism, // testnet
    137: NETWORK.polygon,
    250: NETWORK.fantom,
    288: NETWORK.boba, // mainnet !!!
    324: NETWORK.zkSync,
    // 338: NETWORK.cronos, // testnet
    // 42161: NETWORK.arbitrum,
    42220: NETWORK.celo,
    43114: NETWORK.avalanche,
    // 1085866509: NETWORK.skale, // hackathon chainID
    1313161554: NETWORK.aurora, // !!!
    // 1313161555: NETWORK.aurora, // testnet
    1666600000: NETWORK.harmony, // !!!
    // 1666700000: NETWORK.harmony, // testnet
};

export const networkToId: Record<NetworkType, number> = inverse(idToNetwork);

export const networkInfo = {
    [NETWORK.eth]: {
        chainName: "Ethereum Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.eth]),
        blockExplorerUrls: ["https://etherscan.io"],
        rpcUrls: [`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
    },
    [NETWORK.goerli]: {
        chainName: "Goerli",
        chainId: Web3.utils.toHex(networkToId[NETWORK.goerli]),
        blockExplorerUrls: ["https://goerli.etherscan.io"],
        rpcUrls: [`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`],
        nativeCurrency: {
            name: "GoerliETH",
            symbol: "GoerliETH",
            decimals: 18,
        },
    },
    // mainnet
    [NETWORK.optimism]: {
        chainName: "Optimism",
        chainId: Web3.utils.toHex(networkToId[NETWORK.optimism]),
        rpcUrls: ["https://mainnet.optimism.io/", `https://rpc.ankr.com/optimism/${process.env.REACT_APP_ANKR_KEY}`],
        blockExplorerUrls: ["https://optimistic.etherscan.io"],
        nativeCurrency: {
            name: "KOR",
            symbol: "KOR",
            decimals: 18,
        },
    },
    // testnet
    // [NETWORK.optimism]: {
    //     chainName: "Optimism",
    //     chainId: Web3.utils.toHex(networkToId[NETWORK.optimism]),
    //     rpcUrls: ["https://kovan.optimism.io/"],
    //     blockExplorerUrls: ["https://kovan-optimistic.etherscan.io/"],
    //     nativeCurrency: {
    //         name: "KOR",
    //         symbol: "KOR",
    //         decimals: 18,
    //     },
    // },
    // mainnet
    [NETWORK.boba]: {
        chainName: "Boba",
        chainId: Web3.utils.toHex(networkToId[NETWORK.boba]),
        rpcUrls: ["https://mainnet.boba.network"],
        blockExplorerUrls: ["https://blockexplorer.boba.network/"],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
    },
    // testnet
    // [NETWORK.boba]: {
    //     chainName: "Boba",
    //     chainId: Web3.utils.toHex(networkToId[NETWORK.boba]),
    //     rpcUrls: ["https://rinkeby.boba.network/"],
    //     blockExplorerUrls: ["https://blockexplorer.rinkeby.boba.network/"],
    //     nativeCurrency: {
    //         name: "ETH",
    //         symbol: "ETH",
    //         decimals: 18,
    //     },
    // },
    // [NETWORK.skale]: {
    //     chainName: "Hackathon Skale Chain| downright-royal-saiph",
    //     chainId: Web3.utils.toHex(networkToId[NETWORK.skale]),
    //     rpcUrls: ["https://hackathon.skalenodes.com/v1/downright-royal-saiph"],
    //     blockExplorerUrls: ["https://downright-royal-saiph.explorer.hackathon.skalenodes.com/"],
    //     nativeCurrency: {
    //         name: "sFUEL",
    //         symbol: "sFUEL",
    //         decimals: 18,
    //     },
    // },
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
        rpcUrls: ["https://bsc-dataseed.binance.org/", `https://rpc.ankr.com/bsc/${process.env.REACT_APP_ANKR_KEY}`],
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
        rpcUrls: [`https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`],
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
        rpcUrls: ["https://rpc.ftm.tools/", `https://rpc.ankr.com/fantom/${process.env.REACT_APP_ANKR_KEY}`],
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
        rpcUrls: [
            "https://api.avax.network/ext/bc/C/rpc",
            `https://rpc.ankr.com/avalanche/${process.env.REACT_APP_ANKR_KEY}`,
        ],
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
        rpcUrls: ["https://api.harmony.one", `https://rpc.ankr.com/harmony/${process.env.REACT_APP_ANKR_KEY}`],
        blockExplorerUrls: ["https://explorer.harmony.one/"],
        nativeCurrency: {
            name: "ONE",
            symbol: "ONE",
            decimals: 18,
        },
    },
    [NETWORK.celo]: {
        chainName: "Celo Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.celo]),
        rpcUrls: ["https://forno.celo.org"],
        blockExplorerUrls: ["https://celoscan.io"],
        nativeCurrency: {
            name: "CELO",
            symbol: "CELO",
            decimals: 18,
        },
    },
    [NETWORK.okxchain]: {
        chainName: "OKXChain Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.okxchain]),
        rpcUrls: ["https://exchainrpc.okex.org"],
        blockExplorerUrls: ["https://www.oklink.com/en/okc"],
        nativeCurrency: {
            name: "OKT",
            symbol: "OKT",
            decimals: 18,
        },
    },
    [NETWORK.gnosis]: {
        chainName: "Gnosis",
        chainId: Web3.utils.toHex(networkToId[NETWORK.gnosis]),
        rpcUrls: ["https://rpc.gnosischain.com"],
        blockExplorerUrls: ["https://gnosisscan.io"],
        nativeCurrency: {
            name: "xDAI",
            symbol: "xDAI",
            decimals: 18,
        },
    },
    [NETWORK.zkSync]: {
        chainName: "ZkSync Era Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.zkSync]),
        rpcUrls: ["https://mainnet.era.zksync.io"],
        blockExplorerUrls: ["https://explorer.zksync.io"],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
    },
};

const generateWagmiCustomNetwork = (network: NetworkType) => ({
    id: +networkToId[network],
    name: networkInfo[network].chainName,
    network: networkInfo[network].chainName.toLowerCase(),
    nativeCurrency: networkInfo[network].nativeCurrency,
    rpcUrls: {
        default: { http: networkInfo[network].rpcUrls },
        public: { http: networkInfo[network].rpcUrls },
    },
    blockExplorers: {
        default: { name: `${networkInfo[network].chainName}scan`, url: networkInfo[network].blockExplorerUrls[0] },
    },
});

export const wagmiCustomNetworks: Record<string, Chain> = {
    [NETWORK.cronos]: generateWagmiCustomNetwork(NETWORK.cronos),
    [NETWORK.boba]: generateWagmiCustomNetwork(NETWORK.boba),
    [NETWORK.aurora]: generateWagmiCustomNetwork(NETWORK.aurora),
    [NETWORK.harmony]: generateWagmiCustomNetwork(NETWORK.harmony),
    [NETWORK.celo]: generateWagmiCustomNetwork(NETWORK.celo),
    [NETWORK.okxchain]: generateWagmiCustomNetwork(NETWORK.okxchain),
    [NETWORK.gnosis]: generateWagmiCustomNetwork(NETWORK.gnosis),
    [NETWORK.zkSync]: generateWagmiCustomNetwork(NETWORK.zkSync),
};

export const changeNetworkAtMetamask = async (networkName: NetworkType) => {
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

export const PROVIDER_URL_AVVY = "https://api.avax.network/ext/bc/C/rpc";
