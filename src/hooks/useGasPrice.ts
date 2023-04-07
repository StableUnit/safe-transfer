import { useFeeData } from "wagmi";

import { idToNetwork } from "../utils/network";

export const useGasPrice = (chainId?: number) => {
    const fee = useFeeData({ chainId });
    const networkName = chainId ? idToNetwork[chainId] : undefined;

    return networkName === "zkSync" ? fee.data?.gasPrice ?? undefined : undefined;
};
