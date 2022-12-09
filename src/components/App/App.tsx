import React, { useContext, useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import { SafeAppWeb3Modal } from "@gnosis.pm/safe-apps-web3modal";

import Header from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { Routes } from "../Routes";
import { DEFAULT_NETWORK, NETWORK, networkInfo, networkToId, NetworkType } from "../../utils/network";
import { DispatchContext } from "../../reducer/constants";
import { Actions } from "../../reducer";

import "./App.scss";

const getRPC = () => {
    const res = {} as Record<number, string>;

    Object.keys(NETWORK).forEach((key) => {
        const networkName = NETWORK[key as NetworkType];
        res[networkToId[networkName]] = networkInfo[networkName].rpcUrls[0];
    });

    return res;
};

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: getRPC(),
            chainId: [networkToId[DEFAULT_NETWORK]],
            network: DEFAULT_NETWORK,
            qrcode: true,
            qrcodeModalOptions: {
                mobileLinks: ["metamask", "trust", "rainbow"],
            },
        },
    },
};
const web3Modal = new Web3Modal({
    network: DEFAULT_NETWORK,
    cacheProvider: true,
    providerOptions,
    theme: {
        background: "#313131",
        main: "rgb(255, 255, 255)",
        secondary: "rgb(136, 136, 136)",
        border: "none",
        hover: "rgba(32, 32, 29, 0.8)",
    },
});

const App = () => {
    const [web3, setWeb3] = useState(new Web3(Web3.givenProvider));
    const dispatch = useContext(DispatchContext);

    const onDisconnect = async () => {
        // @ts-ignore
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
            // @ts-ignore
            await web3.currentProvider.close();
        }
        dispatch({ type: Actions.SetCurrentAddress, payload: undefined });
        dispatch({ type: Actions.SetChainId, payload: undefined });
        await web3Modal.clearCachedProvider();
    };
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
    const onConnect = async () => {
        // const provider = await web3Modal.requestProvider();
        const provider = await web3Modal.connect();
        await subscribeProvider(provider);

        const newWeb3: Web3 = new Web3(provider);
        setWeb3(newWeb3);

        const accounts = await web3.eth.getAccounts();
        dispatch({ type: Actions.SetCurrentAddress, payload: accounts[0] });

        const newChainId = await web3.eth.getChainId();
        dispatch({ type: Actions.SetChainId, payload: newChainId });

        // const loadedAsSafeApp = await web3Modal.isSafeApp();
        // console.log("Is connected to safe app:", loadedAsSafeApp);
    };

    useEffect(() => {
        onConnect();
    }, []);

    return (
        <div className="App">
            <Header onConnect={onConnect} onDisconnect={onDisconnect} />
            <div className="App__container">
                <Routes onConnect={onConnect} />
            </div>
            <Footer />
        </div>
    );
};

export default App;
