import React, { useContext, useEffect, useState } from "react";
import { Connector, useConnect, useDisconnect } from "wagmi";
import cn from "classnames";

import Header from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { Routes } from "../Routes";
import { ReactComponent as MetamaskIcon } from "../../ui-kit/images/metamask-circle.svg";
import { ReactComponent as WalletConnectIcon } from "../../ui-kit/images/walletconnect.svg";
import { ReactComponent as GnosisSafeIcon } from "../../ui-kit/images/gnosis-safe.svg";
import { ReactComponent as ArgentIcon } from "../../ui-kit/images/argent.svg";
import { trackEvent } from "../../utils/events";
import { useAutoConnect } from "../../hooks/useAutoConnect";
import { StateContext } from "../../reducer/constants";

import "./App.scss";

const App = () => {
    const { uiSelectedChainId } = useContext(StateContext);
    const [extendedConnectors, setExtendedConnectors] = useState<Connector<any, any, any>[]>([]);
    const { connectAsync, connectors, isLoading, pendingConnector } = useConnect({ chainId: uiSelectedChainId });
    const { disconnect } = useDisconnect();

    const [isModalVisible, setIsModalVisible] = useState(false);

    useAutoConnect();

    useEffect(() => {
        const walletConnect = connectors.find((v) => v.id.toLowerCase() === "walletconnectlegacy");
        if (walletConnect) {
            setExtendedConnectors([...connectors, walletConnect]);
        } else {
            setExtendedConnectors(connectors);
        }
    }, [connectors]);

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
            case "argent":
                return <ArgentIcon />;
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
                        {extendedConnectors.map((selectedConnector, i) => {
                            const id = i === extendedConnectors.length - 1 ? "Argent" : selectedConnector.id;
                            const name = i === extendedConnectors.length - 1 ? "Argent" : selectedConnector.name;
                            return (
                                <div className="connect-modal__provider-wrapper" key={id}>
                                    <div
                                        className={cn("connect-modal__provider-container", {
                                            "connect-modal__provider-container--disabled": !selectedConnector.ready,
                                        })}
                                        key={id}
                                        onClick={handleConnect(selectedConnector)}
                                    >
                                        <div className="connect-modal__provider-icon">{renderIcon(id)}</div>
                                        <div className="connect-modal__provider-name">
                                            {getConnectorName(name)}
                                            {isLoading && id === pendingConnector?.id && " (connecting)"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="connect-modal__fade" onClick={closeModal} />
                </div>
            )}
        </div>
    );
};

export default App;
