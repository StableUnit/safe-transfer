import { useState, useEffect, useContext } from "react";
import { RequestUrlType } from "../utils/urlGenerator";
import { BalanceType } from "../components/SendForm/SendForm";
import { StateContext } from "../reducer/constants";
import { rpcList } from "../utils/rpc";
import CONTRACT_ERC20 from "../contracts/ERC20.json";

export const useCurrentTokenData = (
    balances: BalanceType[],
    selectedToken?: string,
    requestTokenData?: RequestUrlType
) => {
    const { address } = useContext(StateContext);
    const [tokenData, setTokenData] = useState<BalanceType>();

    const { networkName, token: tokenName } = requestTokenData ?? {};

    const updateTokenDataWithRequest = async () => {
        if (tokenName && networkName) {
            const tokenContract = new rpcList[networkName].eth.Contract(CONTRACT_ERC20 as any, tokenName);

            setTokenData({
                token_address: tokenName,
                name: await tokenContract.methods.name().call(),
                symbol: await tokenContract.methods.symbol().call(),
                decimals: await tokenContract.methods.decimals().call(),
                balance: address ? await tokenContract.methods.balanceOf(address).call() : "0",
            });
        }
    };

    useEffect(() => {
        updateTokenDataWithRequest();
    }, [networkName, tokenName, address]);

    useEffect(() => {
        if (!requestTokenData) {
            setTokenData(balances.find((v) => v.token_address === selectedToken));
        }
    }, [balances, requestTokenData, selectedToken]);

    return tokenData;
};
