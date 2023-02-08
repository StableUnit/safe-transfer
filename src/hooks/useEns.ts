import { useState, useEffect } from "react";
import Web3 from "web3";
import { addressToEns, ensToAddress } from "../utils/wallet";

export const useEns = (address?: string) => {
    const [ensAddress, setEnsAddress] = useState<string | null>();
    const [ensName, setEnsName] = useState<string | null>();
    const [isEnsNameLoading, setIsEnsNameLoading] = useState(false);

    const updateData = async () => {
        setEnsAddress(undefined);
        setEnsName(undefined);
        setIsEnsNameLoading(false);

        if (address && Web3.utils.isAddress(address)) {
            setEnsAddress(address);
            setEnsName(await addressToEns(address));
        }
        if (address?.includes(".eth")) {
            setEnsName(address);
            setIsEnsNameLoading(true);
            setEnsAddress(await ensToAddress(address));
            setIsEnsNameLoading(false);
        }
    };

    useEffect(() => {
        updateData();
    }, [address]);

    return {
        isEnsAddress: !!(address && Web3.utils.isAddress(address)),
        isEnsName: !!address?.includes(".eth"),
        ensAddress,
        ensName,
        isEnsNameLoading,
    };
};
