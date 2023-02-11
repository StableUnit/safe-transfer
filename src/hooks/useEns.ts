import { useState, useEffect } from "react";
import Web3 from "web3";
import { addressToAvvy, addressToEns, avvyToAddress, ensToAddress } from "../utils/wallet";

export const useEns = (address?: string) => {
    const [ensAddress, setEnsAddress] = useState<string | null>();
    const [ensName, setEnsName] = useState<string | null>();
    const [avvyName, setAvvyName] = useState<string | null>();
    const [isEnsNameLoading, setIsEnsNameLoading] = useState(false);
    const [isAvvyNameLoading, setIsAvvyNameLoading] = useState(false);

    const updateData = async () => {
        setEnsAddress(undefined);
        setEnsName(undefined);
        setIsEnsNameLoading(false);

        if (address && Web3.utils.isAddress(address)) {
            setEnsAddress(address);
            setEnsName(await addressToEns(address));
            setAvvyName(await addressToAvvy(address));
        }
        if (address?.includes(".eth")) {
            setIsEnsNameLoading(true);
            setEnsName(address);
            const newAddress = await ensToAddress(address);
            setEnsAddress(newAddress);
            setAvvyName(await addressToAvvy(newAddress));
            setIsEnsNameLoading(false);
        }
        if (address?.includes(".avax")) {
            setIsAvvyNameLoading(true);
            setAvvyName(address);
            const newAddress = await avvyToAddress(address);
            setEnsAddress(newAddress);
            setEnsName(await addressToEns(newAddress));
            setIsAvvyNameLoading(false);
        }
    };

    useEffect(() => {
        updateData();
    }, [address]);

    return {
        isEnsAddress: !!(address && Web3.utils.isAddress(address)),
        isEnsName: !!address?.includes(".eth"),
        isAvvyName: !!address?.includes(".avax"),
        ensAddress,
        ensName,
        avvyName,
        isEnsNameLoading,
        isAvvyNameLoading,
    };
};
