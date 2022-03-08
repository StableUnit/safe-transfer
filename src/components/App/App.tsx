import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal, { IProviderOptions } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import Header from "../Header/Header";
import { NETWORK_TYPE, NETWORK_TYPE_CODE } from "../../utils/wallet";
import { setUtilsWeb3, setUtilsCurrentAddress } from "../../utils/api";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";
import Instructions from "../Insctructions/Instructions";
import MainForm from "../MainForm/MainForm";
import { idToNetwork, NetworkType } from "../../utils/network";

import "./App.scss";

const providerOptions: IProviderOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "7b02ac15229546749b13227c7a2e79e7",
            rpc: { [NETWORK_TYPE_CODE]: "https://polygon-rpc.com/" },
        },
    },
};
const web3Modal = new Web3Modal({ network: NETWORK_TYPE, cacheProvider: true, providerOptions });

const App = () => {
    const [web3, setWeb3] = useState(new Web3(Web3.givenProvider));
    const [currentAddress, setCurrentAddress] = useState(undefined as string | undefined);
    const [currentNetwork, setCurrentNetwork] = useState(undefined as NetworkType | undefined);

    const onDisconnect = async () => {
        // @ts-ignore
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
            // @ts-ignore
            await web3.currentProvider.close();
        }
        setCurrentAddress(undefined);
        await web3Modal.clearCachedProvider();
        document.location.reload();
    };

    const subscribeProvider = async (newProvider: any) => {
        if (!newProvider.on) {
            return;
        }
        newProvider.on("close", () => {
            onDisconnect();
        });
        newProvider.on("accountsChanged", async (accounts: string[]) => {
            setCurrentAddress(accounts[0]);
            setUtilsCurrentAddress(accounts[0]);
        });
        newProvider.on("networkChanged", async (chainId: string) => {
            if (+chainId === NETWORK_TYPE_CODE) {
                await onConnect();
            }
            setCurrentNetwork(idToNetwork[+chainId]);
        });
    };

    const onConnect = async () => {
        const provider = await web3Modal.connect();
        await subscribeProvider(provider);

        const newWeb3: Web3 = new Web3(provider);
        setUtilsWeb3(newWeb3);
        setWeb3(newWeb3);

        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        setCurrentAddress(address);
        setUtilsCurrentAddress(address);
        const chainId = await web3.eth.getChainId();
        setCurrentNetwork(idToNetwork[chainId]);
    };

    useEffect(() => {
        onConnect();
    }, []);

    return (
        <div className="App">
            <Header onConnect={onConnect} onDisconnect={onDisconnect} address={currentAddress} />
            <div className="App__container">
                <YoutubeEmbed embedId="qx3rxGSVBDM" />
                <Instructions />
                {currentNetwork && <MainForm currentNetwork={currentNetwork} />}
            </div>
        </div>
    );
};

export default App;
