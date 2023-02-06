import React, { useContext, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useEnsName, useNetwork } from "wagmi";

import Header from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { Routes } from "../Routes";
import { DispatchContext } from "../../reducer/constants";
import { Actions } from "../../reducer";
import { BugIcon } from "../../ui-kit/images/icons";
import { ReactComponent as MetamaskIcon } from "../../ui-kit/images/metamask-circle.svg";
import { ReactComponent as WalletConnectIcon } from "../../ui-kit/images/walletconnect.svg";

import "./App.scss";

const App = () => {
    const dispatch = useContext(DispatchContext);
    const { address, connector } = useAccount();
    const { data: ensName } = useEnsName({ address });
    const { connect, connectors, isLoading, pendingConnector } = useConnect();
    const { disconnect } = useDisconnect();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const { chain } = useNetwork();
    console.log(ensName);

    useEffect(() => {
        console.log("address", address);
        dispatch({ type: Actions.SetCurrentAddress, payload: address });
    }, [dispatch, address]);

    useEffect(() => {
        console.log("chain", chain);
        dispatch({ type: Actions.SetChainId, payload: chain?.id });
    }, [dispatch, chain]);

    useEffect(() => {
        console.log("connector", connector);
    }, [connector]);

    const openModal = () => {
        setIsModalVisible(true);
    };
    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleConnect = (selectedConnector: any) => () => {
        connect({ connector: selectedConnector });
        closeModal();
    };

    const onBugClick = () => {
        window.open(
            // eslint-disable-next-line max-len
            "https://github.com/StableUnit/safe-transfer/issues/new?assignees=Kud8&labels=&template=bug_report.md&title=%5BBUG%5D",
            "_blank"
        );
    };

    const renderIcon = (id: string) => {
        switch (id.toLowerCase()) {
            case "metamask":
                return <MetamaskIcon />;
            case "walletconnect":
                return <WalletConnectIcon />;
            default:
                return null;
        }
    };

    return (
        <div className="App">
            <Header onConnect={openModal} onDisconnect={disconnect} />
            <div className="App__container">
                <Routes onConnect={openModal} />
            </div>
            <BugIcon className="bug-icon" onClick={onBugClick} />
            <Footer />
            {isModalVisible && (
                <div className="connect-modal">
                    <div className="connect-modal__card">
                        {connectors.map((selectedConnector) => (
                            <div className="connect-modal__provider-wrapper">
                                <div
                                    className="connect-modal__provider-container"
                                    key={selectedConnector.id}
                                    onClick={handleConnect(selectedConnector)}
                                >
                                    <div className="connect-modal__provider-icon">
                                        {renderIcon(selectedConnector.id)}
                                    </div>
                                    <div className="connect-modal__provider-name">
                                        {selectedConnector.name}
                                        {!selectedConnector.ready && " (unsupported)"}
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
