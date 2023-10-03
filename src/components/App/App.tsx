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
        const walletConnect = connectors.find((v) =>
            ["walletconnect", "walletconnectlegacy"].includes(v.id.toLowerCase())
        );
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
            case "walletconnect":
            case "walletconnectlegacy":
                return "WalletConnect";
            default:
                return name;
        }
    };

    return (
        <div className="App" id="app">
            <div className="App__container">
                <Routes onConnect={openModal} />
            </div>
        </div>
    );
};

export default App;
