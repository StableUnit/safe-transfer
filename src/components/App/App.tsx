import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import cn from "classnames";

import Header from "../Header/Header";
import Instructions from "../Insctructions/Instructions";
import ApproveForm from "../ApproveForm/ApproveForm";
import TransferForm from "../TransferForm/TransferForm";

import "./App.scss";
import { Footer } from "../Footer/Footer";

const DEFAULT_CHAIN_ID = 137;

const App = () => {
    const { logout, authenticate, isWeb3Enabled, isAuthenticated, enableWeb3 } = useMoralis();
    const [token, setToken] = useState<string | null>(null);
    const [isInstructions, setIsInstructions] = useState(true);

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
        enableWeb3({ chainId: DEFAULT_CHAIN_ID });
    };

    useEffect(() => {
        if (!isWeb3Enabled && isAuthenticated) {
            enableWeb3({ chainId: DEFAULT_CHAIN_ID });
        }
    }, [isWeb3Enabled, isAuthenticated, enableWeb3]);

    const handleOnCloseInstructions = () => {
        setIsInstructions(false);
    };

    return (
        <div className={cn("App", { "App--padded": !isInstructions })}>
            <Header
                token={token}
                onMetamaskConnect={onMetamaskConnect}
                onWalletConnect={onWalletConnect}
                onDisconnect={onDisconnect}
            />
            <div className="App__container">
                {isInstructions && <Instructions onClose={handleOnCloseInstructions} />}
                {token ? <TransferForm token={token} /> : <ApproveForm onMetamaskConnect={onMetamaskConnect} />}
            </div>
            <Footer />
        </div>
    );
};

export default App;
