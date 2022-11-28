import React, { useEffect, useState } from "react";
import cn from "classnames";

import Header from "../Header/Header";
import Instructions from "../Insctructions/Instructions";
import SendForm from "../SendForm/SendForm";
import ReceiveForm from "../ReceiveForm/ReceiveForm";
import { Footer } from "../Footer/Footer";
import WalletModal from "../WalletModal/WalletModal";

import "./App.scss";
import useWalletConnect from "../../hooks/useWalletConnect";
import useMetamask from "../../hooks/useMetamask";
import { Routes } from "../Routes";

const App = () => {
    const [showModal, setShowModal] = useState(false);
    const { connect: connectWC, disconnect: disconnectWC } = useWalletConnect();
    const { connect: connectMetamask, disconnect: disconnectMetamask } = useMetamask();

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

    return (
        <div className="App">
            <Header onConnect={onConnect} onDisconnect={onDisconnect} />
            <div className="App__container">
                <Routes onConnect={onConnect} />
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
