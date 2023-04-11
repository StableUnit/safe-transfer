import { useState, useEffect, useContext } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { SelectChangeEvent } from "@mui/material";
import { getVolume, trackEvent } from "../utils/events";
import { idToNetwork, networkInfo, networkToId, NetworkType } from "../utils/network";
import { Actions } from "../reducer";
import { DispatchContext } from "../reducer/constants";

export const useNetworkChange = () => {
    const { chain } = useNetwork();
    const { address, connector } = useAccount();
    const dispatch = useContext(DispatchContext);
    const { switchNetworkAsync } = useSwitchNetwork();

    const onNetworkChange = async (event: SelectChangeEvent) => {
        const newNetworkName = event.target.value as NetworkType;
        const chainId = +networkToId[newNetworkName];
        if (switchNetworkAsync && connector?.switchChain) {
            try {
                await connector.switchChain(chainId);
                dispatch({ type: Actions.SetUISelectedChainId, payload: chainId });
                trackEvent("NetworkChanged", { address, network: event.target.value });
            } catch (e: any) {
                try {
                    console.log(e);
                    // if user not rejected the request (https://eips.ethereum.org/EIPS/eip-1193#error-standards)
                    if (e.code !== 4001) {
                        await window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: [networkInfo[event.target.value]],
                        });
                        trackEvent("NetworkAdded", { address, network: event.target.value });
                    }
                } catch (addError) {
                    console.error(addError);
                }
            }
        } else {
            dispatch({ type: Actions.SetUISelectedChainId, payload: chainId });
        }
    };

    return {
        chainId: chain?.id,
        networkName: chain?.id ? idToNetwork[chain.id] : undefined,
        onNetworkChange,
    };
};
