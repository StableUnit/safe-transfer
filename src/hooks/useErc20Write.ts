import { useContractWrite, useNetwork } from "wagmi";

import CONTRACT_ERC20 from "../contracts/ERC20.json";

export const useErc20Write = (tokenAddress: string | undefined, functionName: string) => {
    const { chain } = useNetwork();

    const erc20Config = {
        mode: "recklesslyUnprepared" as "recklesslyUnprepared" | "prepared",
        address: tokenAddress as `0x${string}`,
        abi: CONTRACT_ERC20,
        chainId: chain?.id,
    };

    const { writeAsync } = useContractWrite({ ...erc20Config, functionName });

    return writeAsync;
};
