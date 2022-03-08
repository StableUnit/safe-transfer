import Web3 from "web3";

export type NetworkType = "eth" | "polygon" | "arbitrum" | "optimism";

export const NETWORK: Record<NetworkType, NetworkType> = {
    eth: "eth",
    polygon: "polygon",
    arbitrum: "arbitrum",
    optimism: "optimism",
};

export const networkNames = {
    [NETWORK.eth]: "Ethereum",
    [NETWORK.polygon]: "Polygon",
    [NETWORK.arbitrum]: "Arbitrum",
    [NETWORK.optimism]: "Optimism",
};

const inverse = (obj: Record<any, any>) => Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));

export const idToNetwork: Record<number, NetworkType> = {
    1: NETWORK.eth,
    10: NETWORK.optimism,
    137: NETWORK.polygon,
    42161: NETWORK.arbitrum,
};

export const networkToId = inverse(idToNetwork);

const networkInfo = {
    [NETWORK.eth]: {
        chainName: "Ethereum Mainnet",
        chainId: Web3.utils.toHex(networkToId[NETWORK.eth]),
        rpcUrls: ["https://rpc.ankr.com/eth"],
    },
    [NETWORK.optimism]: {
        chainName: "Optimism",
        chainId: Web3.utils.toHex(networkToId[NETWORK.optimism]),
        rpcUrls: ["https://mainnet.optimism.io/"],
        blockExplorerUrls: ["https://optimistic.etherscan.io"],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
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
    [NETWORK.arbitrum]: {
        chainName: "Arbitrum One",
        chainId: Web3.utils.toHex(networkToId[NETWORK.arbitrum]),
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io"],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
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
