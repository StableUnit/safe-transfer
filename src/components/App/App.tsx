import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

import Header from "../Header/Header";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import Instructions from "../Insctructions/Instructions";
import ApproveForm from "../ApproveForm/ApproveForm";
import TransferForm from "../TransferForm/TransferForm";

import "./App.scss";
import { Footer } from "../Footer/Footer";

const DEFAULT_CHAIN_ID = 1;

const App = () => {
    const { logout, authenticate, isWeb3Enabled, isAuthenticated, enableWeb3 } = useMoralis();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setToken(urlParams.get("token"));
    }, []);

    const onDisconnect = async () => {
        await logout();
    };

    const onWalletConnect = async () => {
        authenticate({
            provider: "walletconnect",
        });
    };

    const onMetamaskConnect = () => {
        // authenticate();
        enableWeb3();
    };

    useEffect(() => {
        if (!isWeb3Enabled && isAuthenticated) {
            enableWeb3({ chainId: DEFAULT_CHAIN_ID });
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
                {token ? <TransferForm token={token} /> : <ApproveForm />}
            </div>
            <Footer />
        </div>
    );
};

export default App;
