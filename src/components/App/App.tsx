import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import cn from "classnames";
import Web3 from "web3";

import Header from "../Header/Header";
import Instructions from "../Insctructions/Instructions";
import ApproveForm from "../ApproveForm/ApproveForm";
import TransferForm from "../TransferForm/TransferForm";
import { Footer } from "../Footer/Footer";
import { NETWORK, networkInfo, NetworkType } from "../../utils/network";
import WalletModal from "../WalletModal/WalletModal";

import "./App.scss";
import useWalletConnect from "../../hooks/useWalletConnect";

const DEFAULT_CHAIN_ID = 137;

const App = () => {
    const { logout, authenticate, isWeb3Enabled, isAuthenticated, enableWeb3 } = useMoralis();
    const [showModal, setShowModal] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [isInstructions, setIsInstructions] = useState(true);
    const { connect, disconnect } = useWalletConnect();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setToken(urlParams.get("token"));
    }, []);

    const openModal = () => {
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    const onConnect = () => {
        openModal();
    };

    const onDisconnect = async () => {
        await logout();
        await disconnect();
    };

    const onWalletConnect = async () => {
        authenticate({
            provider: "walletconnect",
            mobileLinks: ["metamask", "trust"],
            chainId: DEFAULT_CHAIN_ID,
        });
        closeModal();
    };

    const onWalletConnectNative = async () => {
        await connect();
    };

    const onMetamaskConnect = () => {
        enableWeb3({ chainId: DEFAULT_CHAIN_ID });
        closeModal();
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
            <Header token={token} onConnect={onConnect} onDisconnect={onDisconnect} />
            <div className="App__container">
                {isInstructions && <Instructions onClose={handleOnCloseInstructions} />}
                {token ? <TransferForm onConnect={onConnect} token={token} /> : <ApproveForm onConnect={onConnect} />}
            </div>
            <Footer />
            <WalletModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onMetamaskConnect={onMetamaskConnect}
                onWalletConnect={onWalletConnect}
                onWalletConnectNative={onWalletConnectNative}
            />
        </div>
    );
};

export default App;
