import React, { useContext, useEffect, useState } from "react";
import { useConnect, useDisconnect } from "wagmi";
import cn from "classnames";

import Header from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { Routes } from "../Routes";
import { ReactComponent as MetamaskIcon } from "../../ui-kit/images/metamask-circle.svg";
import { ReactComponent as WalletConnectIcon } from "../../ui-kit/images/walletconnect.svg";
import { ReactComponent as GnosisSafeIcon } from "../../ui-kit/images/gnosis-safe.svg";
import { trackEvent } from "../../utils/events";
import { useAutoConnect } from "../../hooks/useAutoConnect";
import { StateContext } from "../../reducer/constants";

import "./App.scss";

const App = () => {
    const { uiSelectedChainId } = useContext(StateContext);
    const { connectAsync, connectors, isLoading, pendingConnector } = useConnect({ chainId: uiSelectedChainId });
    const { disconnect } = useDisconnect();

    const [isModalVisible, setIsModalVisible] = useState(false);

    useAutoConnect();

    useEffect(() => {
        trackEvent("pageLoaded", { location: window.location.href });
    }, []);

    const openModal = () => {
        trackEvent("openModal");
        setIsModalVisible(true);
    };
    const closeModal = () => {
        trackEvent("closeModal");
        setIsModalVisible(false);
    };

    const handleConnect = (selectedConnector: any) => async () => {
        trackEvent("connect-wallet", { name: selectedConnector.name, location: window.location.href });
        await connectAsync({
            connector: selectedConnector,
            chainId: uiSelectedChainId,
        });
        closeModal();
    };

    const renderIcon = (id: string) => {
        switch (id.toLowerCase()) {
            case "metamask":
                return <MetamaskIcon />;
            case "walletconnect":
            case "walletconnectlegacy":
                return <WalletConnectIcon />;
            case "safe":
                return <GnosisSafeIcon />;
            default:
                return null;
        }
    };

    const getConnectorName = (name: string) => {
        switch (name.toLowerCase()) {
            case "walletconnectlegacy":
                return "WalletConnect";
            default:
                return name;
        }
    };

    return (
        <div className="App" id="app">
            <Header onConnect={openModal} onDisconnect={disconnect} />
            <div className="App__container">
                <Routes onConnect={openModal} />
            </div>
            <Footer />
            {isModalVisible && (
                <div className="connect-modal">
                    <div className="connect-modal__card">
                        {connectors.map((selectedConnector) => (
                            <div className="connect-modal__provider-wrapper" key={selectedConnector.id}>
                                <div
                                    className={cn("connect-modal__provider-container", {
                                        "connect-modal__provider-container--disabled": !selectedConnector.ready,
                                    })}
                                    key={selectedConnector.id}
                                    onClick={handleConnect(selectedConnector)}
                                >
                                    <div className="connect-modal__provider-icon">
                                        {renderIcon(selectedConnector.id)}
                                    </div>
                                    <div className="connect-modal__provider-name">
                                        {getConnectorName(selectedConnector.name)}
                                        {isLoading && selectedConnector.id === pendingConnector?.id && " (connecting)"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="connect-modal__fade" onClick={closeModal} />
                </div>
            )}
        </div>
    );
};

export default App;
