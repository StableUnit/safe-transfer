import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { useCallback, useContext, useEffect, useState } from "react";
import { rpcList } from "../utils/rpc";
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
                    rpc: rpcList,
                    qrcodeModalOptions: {
                        mobileLinks: ["metamask", "trust"],
                    },
                    infuraId: "55d755b10d6d44388eab19222388b87f",
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
            dispatch({ type: Actions.AddChain, payload: parseInt(hexChainId, 16) });
        },
        [dispatch]
    );

    const handleAccountsChanged = useCallback(
        (accounts: string[]) => {
            dispatch({ type: Actions.AddAddress, payload: accounts[0].toLowerCase() });
        },
        [dispatch]
    );

    useEffect(() => {
        if (provider) {
            provider.on("accountsChanged", handleAccountsChanged);
            provider.on("chainChanged", handleChainChanged);
        }

        return () => {
            if (provider) {
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
