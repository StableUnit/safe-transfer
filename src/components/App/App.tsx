import React, { useEffect, useState } from "react";
import cn from "classnames";

import Header from "../Header/Header";
import Instructions from "../Insctructions/Instructions";
import ApproveForm from "../ApproveForm/ApproveForm";
import TransferForm from "../TransferForm/TransferForm";
import { Footer } from "../Footer/Footer";
import WalletModal from "../WalletModal/WalletModal";

import "./App.scss";
import useWalletConnect from "../../hooks/useWalletConnect";
import useMetamask from "../../hooks/useMetamask";

const DEFAULT_CHAIN_ID = 137;

const App = () => {
    const [showModal, setShowModal] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [isInstructions, setIsInstructions] = useState(true);
    const { connect: connectWC, disconnect: disconnectWC } = useWalletConnect();
    const { connect: connectMetamask, disconnect: disconnectMetamask } = useMetamask();

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
        await disconnectMetamask();
        await disconnectWC();
    };

    const onWalletConnect = async () => {
        await connectWC();
        closeModal();
    };

    const onMetamaskConnect = async () => {
        await connectMetamask();
        closeModal();
    };

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
            />
        </div>
    );
};

export default App;
