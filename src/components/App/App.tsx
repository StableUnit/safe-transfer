import React, { useContext, useEffect } from "react";
import Web3 from "web3";

import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect, useNetwork, useProvider } from "wagmi";
import { disconnect } from "@wagmi/core";

import Header from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { Routes } from "../Routes";
import { DispatchContext } from "../../reducer/constants";
import { Actions } from "../../reducer";
import { BugIcon } from "../../ui-kit/images/icons";

import "./App.scss";

const App = () => {
    const dispatch = useContext(DispatchContext);
    const { open } = useWeb3Modal();
    const { connect } = useConnect();

    const { address, connector, status, isConnected } = useAccount();
    const { chain } = useNetwork();
    const provider = useProvider();

    const subscribeProvider = async (newProvider: any) => {
        if (!newProvider.on) {
            return;
        }
        newProvider.on("close", () => {
            onDisconnect();
        });
        newProvider.on("accountsChanged", async (accounts: string[]) => {
            dispatch({ type: Actions.SetCurrentAddress, payload: accounts[0] });
        });
        newProvider.on("chainChanged", async (hexChainId: string) => {
            const newChainId = Web3.utils.hexToNumber(hexChainId);
            dispatch({ type: Actions.SetChainId, payload: newChainId });
        });
    };

    useEffect(() => {
        subscribeProvider(provider);
    }, [provider]);

    const syncStore = async () => {
        dispatch({ type: Actions.SetCurrentAddress, payload: address });
        dispatch({ type: Actions.SetChainId, payload: chain?.id });
    };
    useEffect(() => {
        if (isConnected) {
            syncStore();
        }
    }, [address, chain, isConnected, status]);

    const onConnect = async () => {
        if (connector) {
            await connect();
        } else {
            await open({ route: "ConnectWallet" });
        }
    };

    const onDisconnect = async () => {
        dispatch({ type: Actions.SetCurrentAddress, payload: undefined });
        dispatch({ type: Actions.SetChainId, payload: undefined });
        await disconnect();
    };

    const onBugClick = () => {
        window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLSf1Tqq8TwjOtgK8_tFndM3QDJW2XTy8oCs6zoPLUWey1nBvwA/viewform",
            "_blank"
        );
    };

    return (
        <div className="App">
            <Header onConnect={onConnect} onDisconnect={onDisconnect} />
            <div className="App__container">
                <Routes onConnect={onConnect} />
            </div>
            <BugIcon className="bug-icon" onClick={onBugClick} />
            <Footer />
        </div>
    );
};

export default App;
