import { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { useNetwork } from "wagmi";
import { addressToAvvy, addressToEns, avvyToAddress, ensToAddress } from "../utils/wallet";
import { addressToBit, bitToAddress } from "../utils/bit";
import { idToNetwork } from "../utils/network";
import { StateContext } from "../reducer/constants";

export const useEns = (address?: string) => {
    const [ensAddress, setEnsAddress] = useState<string | null>();
    const [ensName, setEnsName] = useState<string | null>();
    const [avvyName, setAvvyName] = useState<string | null>();
    const [bitName, setBitName] = useState<string | null>();
    const [isEnsNameLoading, setIsEnsNameLoading] = useState(false);
    const [isAvvyNameLoading, setIsAvvyNameLoading] = useState(false);
    const [isBitNameLoading, setIsBitNameLoading] = useState(false);

    const { uiSelectedChainId } = useContext(StateContext);
    const { chain } = useNetwork();
    const networkName = chain?.id ? idToNetwork[chain?.id] : idToNetwork[uiSelectedChainId];

    const updateData = async () => {
        setEnsAddress(undefined);
        setEnsName(undefined);
        setIsEnsNameLoading(false);

        if (address && Web3.utils.isAddress(address)) {
            setEnsAddress(address);
            setEnsName(await addressToEns(address));
            setAvvyName(await addressToAvvy(address));
            setBitName(await addressToBit(networkName, address));
        }
        if (address?.includes(".eth")) {
            setIsEnsNameLoading(true);
            setEnsName(address);

            const newAddress = await ensToAddress(address);
            setEnsAddress(newAddress);
            setAvvyName(await addressToAvvy(newAddress));
            setBitName(await addressToBit(networkName, newAddress));

            setIsEnsNameLoading(false);
        }
        if (address?.includes(".avax")) {
            setIsAvvyNameLoading(true);
            setAvvyName(address);

            const newAddress = await avvyToAddress(address);
            setEnsAddress(newAddress);
            setEnsName(await addressToEns(newAddress));
            setBitName(await addressToBit(networkName, newAddress));

            setIsAvvyNameLoading(false);
        }
        if (address?.includes(".bit")) {
            setIsBitNameLoading(true);
            setBitName(address);

            const newAddress = await bitToAddress(networkName, address);
            setEnsAddress(newAddress);
            setEnsName(await addressToEns(newAddress));
            setAvvyName(await addressToAvvy(newAddress));

            setIsBitNameLoading(false);
        }
    };

    useEffect(() => {
        if (address) {
            updateData();
        }
    }, [address]);

    return {
        isEnsAddress: !!(address && Web3.utils.isAddress(address)),
        isEnsName: !!address?.includes(".eth"),
        isAvvyName: !!address?.includes(".avax"),
        isBitName: !!address?.includes(".bit"),
        ensAddress: ensAddress ?? undefined,
        ensName,
        avvyName,
        bitName,
        isEnsNameLoading,
        isAvvyNameLoading,
        isBitNameLoading,
    };
};
