import { NETWORK, NetworkType } from "./network";

export const TOKENS_COINGECKO = [
    {
        id: "eth",
        name: "ETH",
        platforms: {
            ethereum: "",
        },
        symbol: "eth",
    },
    {
        id: "tether",
        name: "Tether",
        platforms: {
            "arbitrum-one": "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
            aurora: "0x4988a896b1227218e4a686fde5eabdcabd91571f",
            avalanche: "0xc7198437980c041c805a1edcba50c1ce5db95118",
            "binance-smart-chain": "0x55d398326f99059ff775485246999027b3197955",
            boba: "0x5de1677344d3cb0d7d465c10b72a8f60699c062d",
            cronos: "0x66e428c3f67a68878562e79a0234c1f83c208770",
            ethereum: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            fantom: "0x049d68029688eabf473097a2fc38ef61633a3c7a",
            fuse: "0xfadbbf8ce7d5b7041be672561bba99f79c532e10",
            "harmony-shard-0": "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f",
            "huobi-token": "0xa71edc38d189767582c38a3145b5873052c3e47a",
            iotex: "0x3cdb7c48e70b854ed2fa392e21687501d84b3afc",
            kardiachain: "0x551a5dcac57c66aa010940c2dcff5da9c53aa53b",
            "kucoin-community-chain": "0x0039f574ee5cc39bdd162e9a88e3eb1f111baf48",
            meter: "0x5fa41671c48e3c951afc30816947126ccc8c162e",
            "metis-andromeda": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
            moonbeam: "0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73",
            moonriver: "0xb44a9b6905af7c801311e8f4e76932ee959c663c",
            "okex-chain": "0x382bb369d343125bfb2117af9c149795c6c65c50",
            "optimistic-ethereum": "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
            "polygon-pos": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            solana: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            telos: "0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73",
            tomochain: "0x381b31409e4d220919b2cff012ed94d70135a59e",
        },
        symbol: "usdt",
    },
    {
        id: "dai",
        name: "Dai",
        platforms: {
            "arbitrum-one": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
            aurora: "0xe3520349f477a5f6eb06107066048508498a291b",
            avalanche: "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
            "binance-smart-chain": "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
            cronos: "0xf2001b145b43032aaf5ee2884e456ccd805f677d",
            ethereum: "0x6b175474e89094c44da98b954eedeac495271d0f",
            fantom: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
            "harmony-shard-0": "0xef977d2f931c1978db5f6747666fa1eacb0d0339",
            moonbeam: "0x765277eebeca2e31912c9946eae1021199b39c61",
            moonriver: "0x80a16016cc4a2e6a2caca8a4a498b1699ff0f844",
            "optimistic-ethereum": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
            "polygon-pos": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
            sora: "0x0200060000000000000000000000000000000000000000000000000000000000",
        },
        symbol: "dai",
    },
    {
        id: "bnb",
        name: "BNB",
        platforms: {
            avalanche: "0x264c1383EA520f73dd837F915ef3a732e204a493",
            "binance-smart-chain": "",
            ethereum: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
            "polygon-pos": "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3",
        },
        symbol: "bnb",
    },
    {
        id: "avax",
        name: "AVAX",
        platforms: {
            avalanche: "",
        },
        symbol: "avax",
    },
    {
        id: "matic-network",
        name: "Polygon",
        platforms: {
            "binance-smart-chain": "0xcc42724c6683b7e57334c4e856f4c9965ed682bd",
            ethereum: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            "harmony-shard-0": "0x301259f392b551ca8c592c9f676fcd2f9a0a84c5",
            moonbeam: "0x3405a1bd46b85c5c029483fbecf2f3e611026e45",
            moonriver: "0x682f81e57eaa716504090c3ecba8595fb54561d8",
            "polygon-pos": "0x0000000000000000000000000000000000001010",
            sora: "0x009134d5c7b7fda8863985531f456f89bef5fbd76684a8acdb737b3e451d0877",
        },
        symbol: "matic",
    },
    {
        id: "terra-luna",
        name: "Terra",
        platforms: {
            fantom: "0x95dd59343a893637be1c3228060ee6afbf6f0730",
        },
        symbol: "luna",
    },
    {
        id: "dogecoin",
        name: "Dogecoin",
        platforms: {
            "binance-smart-chain": "0x4206931337dc273a630d328da6441786bfad668f",
        },
        symbol: "doge",
    },
    {
        id: "fantom",
        name: "Fantom",
        platforms: {
            "binance-smart-chain": "0xad29abb318791d579433d831ed122afeaf29dcfe",
            ethereum: "0x4e15361fd6b4bb609fa63c81a2be19d873717870",
            "harmony-shard-0": "0x39ab439897380ed10558666c4377facb0322ad48",
            moonriver: "0xad12dab5959f30b9ff3c2d6709f53c335dc39908",
            fantom: "",
        },
        symbol: "ftm",
    },
];

export const TOKENS = TOKENS_COINGECKO.map((tokenInfo) => {
    const newPlatforms = {
        [NETWORK.eth]: tokenInfo.platforms.ethereum,
        [NETWORK.polygon]: tokenInfo.platforms["polygon-pos"],
        [NETWORK.bsc]: tokenInfo.platforms["binance-smart-chain"],
        [NETWORK.fantom]: tokenInfo.platforms.fantom,
        [NETWORK.avalanche]: tokenInfo.platforms.avalanche,
    } as Record<NetworkType, string | undefined>;

    return {
        ...tokenInfo,
        platforms: newPlatforms,
    };
});
