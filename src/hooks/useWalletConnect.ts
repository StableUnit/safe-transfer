import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { useCallback, useContext, useEffect, useState } from "react";
import { customWeb3s, moralisWeb3s } from "../utils/rpc";
import { DispatchContext } from "../reducer/constants";
import { Actions } from "../reducer";

interface ResultType {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}

export default function useWalletConnect(): ResultType {
    const [provider, setProvider] = useState<WalletConnectProvider>();
    const [web3, setWeb3] = useState<Web3>();
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        if (!provider) {
            setProvider(
                new WalletConnectProvider({
                    rpc: {
                        ...customWeb3s,
                        ...moralisWeb3s,
                    },
                    qrcodeModalOptions: {
                        mobileLinks: ["metamask", "trust"],
                    },
                    qrcode: true,
                })
            );
        }
    }, []);

    useEffect(() => {
        if (provider) {
            // @ts-ignore
            setWeb3(new Web3(provider));
        }
    }, [provider]);

    const handleChainChanged = useCallback(
        (hexChainId: string) => {
            console.log("handleChainChanged", hexChainId);
            dispatch({ type: Actions.AddChain, payload: parseInt(hexChainId, 16) });
        },
        [dispatch]
    );

    const handleAccountsChanged = useCallback(
        (accounts: string[]) => {
            console.log("handleAccountsChanged", accounts);
            dispatch({ type: Actions.AddAddress, payload: accounts[0].toLowerCase() });
        },
        [dispatch]
    );

    useEffect(() => {
        if (provider) {
            console.log("set listeners");
            provider.on("accountsChanged", handleAccountsChanged);
            console.log(provider.connector);
            provider.once("accountsChanged", console.log);
            provider.once("accountChanged", console.log);

            provider.on("chainChanged", handleChainChanged);
            provider.on("connect", console.log);
            provider.on("disconnect", console.log);
        }

        return () => {
            if (provider) {
                console.log("remove listeners");
                provider.removeListener("accountsChanged", handleAccountsChanged);
                provider.removeListener("chainChanged", handleChainChanged);
            }
        };
    }, [provider]);

    //  Enable session (triggers QR Code modal)
    const connect = useCallback(async () => {
        if (provider && web3) {
            await provider.enable();
            dispatch({ type: Actions.AddChain, payload: provider.chainId });
            dispatch({ type: Actions.AddAddress, payload: provider.accounts[0] });
            dispatch({ type: Actions.AddWeb3, payload: web3 });
        }
    }, [dispatch, provider, web3]);

    const disconnect = useCallback(async () => {
        if (provider) {
            await provider.disconnect();
            dispatch({ type: Actions.ClearWalletData });
        }
    }, [dispatch, provider]);

    return {
        connect,
        disconnect,
    };
}
