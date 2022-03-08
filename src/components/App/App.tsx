import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

import Header from "../Header/Header";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import Instructions from "../Insctructions/Instructions";
import MainForm from "../MainForm/MainForm";

import "./App.scss";

// const providerOptions: IProviderOptions = {
//     walletconnect: {
//         package: WalletConnectProvider,
//         options: {
//             infuraId: "7b02ac15229546749b13227c7a2e79e7",
//             rpc: { [NETWORK_TYPE_CODE]: "https://polygon-rpc.com/" },
//         },
//     },
// };
// const web3Modal = new Web3Modal({ network: NETWORK_TYPE, cacheProvider: true, providerOptions });
//
// const web3s: Web3sType = {
//     eth: new Web3("https://mainnet.infura.io/v3/86bd009cb15f4e9eae66a41161b7afc9"),
//     polygon: new Web3("https://polygon-mainnet.g.alchemy.com/v2/ZFHuce-dBtjScdQbxERAcWvfNO75yFOg"),
//     arbitrum: new Web3("https://arb-mainnet.g.alchemy.com/v2/ndddW4Yl9dhi5iWenhZdN4v5x8KEVO9T"),
//     optimism: new Web3("https://opt-mainnet.g.alchemy.com/v2/jM9ZEb8vYJ7GZcgTVknCM8CJ7TmAum2c"),
// };

const DEFAULT_CHAIN_ID = 1;

const App = () => {
    const { logout, authenticate, isWeb3Enabled, isAuthenticated, enableWeb3 } = useMoralis();

    const onDisconnect = async () => {
        await logout();
    };

    const onWalletConnect = async () => {
        authenticate({
            provider: "walletconnect",
            chainId: DEFAULT_CHAIN_ID,
            signingMessage: "Welcome!",
        });
    };

    const onMetamaskConnect = () => {
        authenticate();
    };

    useEffect(() => {
        if (!isWeb3Enabled && isAuthenticated) {
            enableWeb3({ provider: "walletconnect", chainId: DEFAULT_CHAIN_ID });
        }
    }, [isWeb3Enabled, isAuthenticated, enableWeb3]);

    return (
        <div className="App">
            <Header
                onMetamaskConnect={onMetamaskConnect}
                onWalletConnect={onWalletConnect}
                onDisconnect={onDisconnect}
            />
            <div className="App__container">
                <YoutubeEmbed embedId="qx3rxGSVBDM" />
                <Instructions />
                <MainForm />
            </div>
        </div>
    );
};

export default App;
