import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import Moralis from "moralis";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import BN from "bignumber.js";

import { changeNetworkAtMetamask, idToNetwork, NETWORK, networkNames, networkToId } from "../../utils/network";
import { isAddress } from "../../utils/wallet";
import { beautifyTokenBalance, fromHRToBN, TOKENS } from "../../utils/tokens";
import { APPROVE_ABI } from "../../contracts/abi";

import "./MainForm.scss";
import { generateUrl } from "../../utils/urlGenerator";

interface MainFormProps {}

type BalanceType = {
    // eslint-disable-next-line camelcase
    token_address: string;
    name: string;
    symbol: string;
    logo?: string | undefined;
    thumbnail?: string | undefined;
    decimals: string;
    balance: string;
};

const MainForm = () => {
    const { account, chainId: hexChainId } = useMoralis();
    const chainId = Web3.utils.hexToNumber(hexChainId ?? "");
    const networkName = idToNetwork[chainId];
    const [toAddress, setToAddress] = useState<undefined | string>(undefined);
    const [value, setValue] = useState<undefined | number>(undefined);
    const [selectedToken, setSelectedToken] = useState<undefined | string>(undefined); // address
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [genUrl, setGenUrl] = useState<undefined | string>(undefined);
    const Web3Api = useMoralisWeb3Api();

    const availableTokens = TOKENS.filter((token) => token.platforms[networkName] !== undefined);

    const onMount = async () => {
        if (hexChainId) {
            const options = { chain: hexChainId };
            // @ts-ignore
            const result = await Web3Api.account.getTokenBalances(options);
            setBalances(result.sort((a, b) => (a.symbol > b.symbol ? 1 : -1)));
        }
    };

    useEffect(() => {
        onMount();
    }, [hexChainId]);

    const handleNetworkChange = useCallback((event) => {
        changeNetworkAtMetamask(event.target.value);
    }, []);

    if (!account) {
        return <div className="main-form">Please connect your wallet</div>;
    }

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToAddress(event.target.value);
    };

    const handleTokenChange = (event: SelectChangeEvent) => {
        setSelectedToken(event.target.value);
    };

    const handleValueChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(+event.target.value);
    };

    const handleApprove = async () => {
        const selectedTokenInfo = balances.find((v) => v.token_address === selectedToken);
        if (selectedTokenInfo && value && toAddress) {
            setGenUrl(undefined);
            const contractAddress = selectedTokenInfo.token_address;
            const valueBN = fromHRToBN(value, +selectedTokenInfo.decimals).toString();
            const options = {
                contractAddress,
                functionName: "approve",
                abi: APPROVE_ABI,
                params: { _spender: toAddress, _value: valueBN },
            };
            const result = await Moralis.executeFunction(options);
            setGenUrl(generateUrl(options.contractAddress, toAddress, valueBN));
            console.log(result);
        }
    };

    const isCorrectData = isAddress(toAddress) && (value ?? 0) > 0;

    return (
        <div className="main-form">
            <FormControl className="main-form__network-form">
                <InputLabel id="network-form-label">Network</InputLabel>
                <Select labelId="network-form-label" value={networkName} label="Network" onChange={handleNetworkChange}>
                    {Object.entries(networkNames).map(([id, name]) => (
                        <MenuItem key={id} value={id}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                id="address"
                className="main-form__address"
                label="Address"
                variant="outlined"
                onChange={handleAddressChange}
            />
            <FormControl className="main-form__token-form">
                <InputLabel id="token-form-label">Token</InputLabel>
                <Select labelId="token-form-label" value={selectedToken} label="Token" onChange={handleTokenChange}>
                    {balances.map((token) => (
                        <MenuItem key={token.token_address} value={token.token_address}>
                            {token.symbol} ({beautifyTokenBalance(token.balance, +token.decimals)})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                id="value"
                className="main-form__value"
                label="Value"
                type="number"
                onChange={handleValueChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button variant="contained" onClick={handleApprove} className="main-form__button" disabled={!isCorrectData}>
                Approve
            </Button>
            {genUrl && (
                <div className="main-form__url">
                    <div>New URL:</div>
                    <div>{genUrl}</div>
                </div>
            )}
        </div>
    );
};

export default MainForm;
