import { useContext } from "react";
import { useMoralis } from "react-moralis";
import { StateContext } from "../reducer/constants";

export default function useWalletData() {
    const { walletAddress, walletChainId, web3 } = useContext(StateContext);
    const { account, chainId: hexChainId, web3: moralisWeb3 } = useMoralis();

    return {
        address: walletAddress ?? account,
        chainId: walletChainId ?? parseInt(hexChainId ?? "0", 16),
        web3: web3 ?? moralisWeb3,
    };
}
