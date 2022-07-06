import detectEthereumProvider from "@metamask/detect-provider";
import { useCallback, useContext, useEffect, useState } from "react";
import { BaseProvider } from "@metamask/providers";
import Web3 from "web3";
import { DispatchContext } from "../reducer/constants";
import { Actions } from "../reducer";

interface ResultType {
    connect: () => void;
    disconnect: () => void;
}

const useMetamask: (enableListeners?: boolean) => ResultType = (enableListeners = true) => {
    const [metamaskProvider, setMetamaskProvider] = useState<BaseProvider>();
    const [isConnected, setIsConnected] = useState(false);
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        detectEthereumProvider({ mustBeMetaMask: true })
            .then((provider) => {
                if (provider) {
                    setMetamaskProvider(provider as BaseProvider);
                }
            })
            .catch(console.error);
    }, []);

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
        if (metamaskProvider && enableListeners && isConnected) {
            metamaskProvider.on("accountsChanged", handleAccountsChanged);
            metamaskProvider.on("chainChanged", handleChainChanged);
        }

        return () => {
            if (metamaskProvider && enableListeners && isConnected) {
                metamaskProvider.removeListener("chainChanged", handleChainChanged);
                metamaskProvider.removeListener("accountsChanged", handleAccountsChanged);
            }
        };
    }, [enableListeners, handleAccountsChanged, handleChainChanged, metamaskProvider, isConnected]);

    const connect = useCallback(async () => {
        if (metamaskProvider) {
            const accounts = await metamaskProvider.request<string[]>({
                method: "eth_requestAccounts",
            });
            const metamaskChainId = await metamaskProvider.request<string>({
                method: "eth_chainId",
            });

            const account = accounts?.[0];
            if (account) {
                dispatch({ type: Actions.AddAddress, payload: account });
            }
            if (metamaskChainId) {
                dispatch({ type: Actions.AddChain, payload: +metamaskChainId });
            }

            dispatch({ type: Actions.AddWeb3, payload: new Web3(Web3.givenProvider) });
            setIsConnected(true);
        }
    }, [dispatch, metamaskProvider]);

    const disconnect = useCallback(async () => {
        dispatch({ type: Actions.ClearWalletData });
        setIsConnected(false);
    }, [dispatch]);

    return {
        connect,
        disconnect,
    };
};

export default useMetamask;
