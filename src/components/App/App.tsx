import React, { useContext, useEffect } from "react";
import Web3 from "web3";

import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

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
    const { disconnect } = useDisconnect();

    const { address } = useAccount();
    const { chain } = useNetwork();

    const syncStore = async () => {
        dispatch({ type: Actions.SetCurrentAddress, payload: address });
        dispatch({ type: Actions.SetChainId, payload: chain?.id });
        dispatch({ type: Actions.SetWeb3, payload: new Web3(Web3.givenProvider) });
    };
    useEffect(() => {
        syncStore();
    }, [address, chain]);

    const onConnect = async () => {
        await open();
    };

    const onDisconnect = async () => {
        await disconnect();
        dispatch({ type: Actions.SetCurrentAddress, payload: undefined });
        dispatch({ type: Actions.SetChainId, payload: undefined });
    };

    const onBugClick = () => {
        window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLSf1Tqq8TwjOtgK8_tFndM3QDJW2XTy8oCs6zoPLUWey1nBvwA/viewform",
            "_blank"
        );
    };

    // useEffect(() => {
    //     if (web3Modal.cachedProvider) {
    //         onConnect();
    //     }
    // }, []);

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
