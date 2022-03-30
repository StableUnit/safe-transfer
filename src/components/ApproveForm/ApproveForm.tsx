import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import Moralis from "moralis";
import { FormControl, IconButton, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import cn from "classnames";

import { changeNetworkAtMetamask, getTrxHashLink, idToNetwork, networkNames } from "../../utils/network";
import { isAddress } from "../../utils/wallet";
import { beautifyTokenBalance, fromHRToBN } from "../../utils/tokens";
import { APPROVE_ABI } from "../../contracts/abi";
import { generateUrl } from "../../utils/urlGenerator";
import { ReactComponent as ArrowDownIcon } from "../../ui-kit/images/arrow-down.svg";

import "./ApproveForm.scss";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";

import Button from "../../ui-kit/components/Button/Button";
import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";

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

interface ApproveFormProps {
    onMetamaskConnect?: () => void;
}

const ApproveForm = ({ onMetamaskConnect }: ApproveFormProps) => {
    const { account, chainId: hexChainId } = useMoralis();
    const chainId = Web3.utils.hexToNumber(hexChainId ?? "");
    const networkName = idToNetwork[chainId];
    const [toAddress, setToAddress] = useState<undefined | string>(undefined);
    const [value, setValue] = useState<undefined | number>(undefined);
    const [selectedToken, setSelectedToken] = useState<undefined | string>(undefined); // address
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [trxHash, setTrxHash] = useState("");
    const [trxLink, setTrxLink] = useState("");
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [genUrl, setGenUrl] = useState<undefined | string>(undefined);
    const Web3Api = useMoralisWeb3Api();

    const onMount = async () => {
        if (hexChainId) {
            const options = { chain: hexChainId, address: account };
            // @ts-ignore
            const result = await Web3Api.account.getTokenBalances(options);
            setBalances(result.sort((a, b) => (a.symbol > b.symbol ? 1 : -1)));
        }
    };

    useEffect(() => {
        onMount();
    }, [hexChainId, account]);

    const handleNetworkChange = useCallback((event) => {
        changeNetworkAtMetamask(event.target.value);
    }, []);

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToAddress(event.target.value);
    };

    const handleTokenChange = (event: SelectChangeEvent) => {
        setSelectedToken(event.target.value);
    };

    const handleValueChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(value, +event.target.value);
        setValue(+event.target.value);
    };

    const handleCopyGenUrl = () => {
        if (genUrl) {
            navigator.clipboard.writeText(genUrl);
            addSuccessNotification("Copied", undefined, true);
        }
    };

    const handleApprove = async () => {
        const selectedTokenInfo = balances.find((v) => v.token_address === selectedToken);
        if (selectedTokenInfo && value && toAddress && account) {
            try {
                setGenUrl(undefined);
                setTrxHash("");
                setTrxLink("");
                setIsApproveLoading(true);
                const contractAddress = selectedTokenInfo.token_address;
                const valueBN = fromHRToBN(value, +selectedTokenInfo.decimals).toString();
                const options = {
                    contractAddress,
                    functionName: "approve",
                    abi: APPROVE_ABI,
                    params: { _spender: toAddress, _value: valueBN },
                };
                const transaction = await Moralis.executeFunction(options);
                setTrxHash(transaction.hash);
                setTrxLink(getTrxHashLink(transaction.hash, networkName));
                // @ts-ignore
                await transaction.wait();
                addSuccessNotification("Success", "Approve transaction completed");
                setIsApproveLoading(false);
                setGenUrl(
                    generateUrl({
                        address: options.contractAddress,
                        from: account,
                        to: toAddress,
                        value: valueBN,
                        chain: networkName,
                    })
                );
            } catch (e) {
                addErrorNotification("Error", "Approve transaction failed");
                setIsApproveLoading(false);
            }
        }
    };

    const isCorrectData = isAddress(toAddress) && (value ?? 0) > 0 && selectedToken;
    const currentToken = balances.find((v) => v.token_address === selectedToken);
    const currentTokenBalance = currentToken ? beautifyTokenBalance(currentToken.balance, +currentToken.decimals) : 0;

    const handleMaxClick = () => {
        console.log("handleMaxClick", currentTokenBalance, value);
        setValue(+currentTokenBalance);
    };

    return (
        <div className={cn("approve-form", { "approve-form--disabled": !account })}>
            <div className="approve-form__title">Send</div>

            <div className="approve-form__content">
                <div className="approve-form__label">Network</div>
                <FormControl className="approve-form__network-form">
                    <Select
                        value={networkName || "placeholder-value"}
                        onChange={handleNetworkChange}
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={ArrowDownIcon}
                        MenuProps={{ classes: { paper: "approve-form__paper", list: "approve-form__list" } }}
                    >
                        <MenuItem disabled value="placeholder-value">
                            <NetworkImage />
                            Select network
                        </MenuItem>
                        {Object.entries(networkNames).map(([id, name]) => (
                            <MenuItem key={id} value={id}>
                                <NetworkImage network={id} />
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div className="approve-form__label">Recipient address</div>
                <TextField
                    id="address"
                    className="approve-form__address"
                    placeholder="Paste address here ..."
                    variant="outlined"
                    onChange={handleAddressChange}
                />

                <div className="approve-form__content__line">
                    <div className="approve-form__label">Balance: {currentTokenBalance}</div>
                    <div className="approve-form__max-button" onClick={handleMaxClick}>
                        MAX
                    </div>
                </div>

                <div className="approve-form__content__line">
                    <FormControl className="approve-form__token-form">
                        <Select
                            value={selectedToken || "placeholder-value"}
                            onChange={handleTokenChange}
                            inputProps={{ "aria-label": "Without label" }}
                            IconComponent={ArrowDownIcon}
                            MenuProps={{
                                classes: {
                                    root: "approve-form__token-dropdown",
                                    paper: "approve-form__paper",
                                    list: "approve-form__list",
                                },
                            }}
                        >
                            <MenuItem disabled value="placeholder-value">
                                Token
                            </MenuItem>
                            {balances.map((token) => (
                                <MenuItem key={token.token_address} value={token.token_address}>
                                    <div>{token.symbol}</div>
                                    <div className="approve-form__token-form__balance">
                                        {beautifyTokenBalance(token.balance, +token.decimals)}
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        id="value"
                        className="approve-form__value"
                        placeholder="0.00"
                        type="number"
                        onChange={handleValueChange}
                        value={value}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>

            {account ? (
                <Button
                    onClick={handleApprove}
                    className="approve-form__button"
                    disabled={!isCorrectData || isApproveLoading}
                >
                    {isApproveLoading ? "Loading..." : "Approve"}
                </Button>
            ) : (
                <Button onClick={onMetamaskConnect} className="approve-form__button">
                    CONNECT WALLET
                </Button>
            )}

            {trxHash && (
                <div className="approve-form__hash">
                    Your transaction hash:{" "}
                    <a href={trxLink} target="_blank" rel="noreferrer">
                        {trxHash}
                    </a>
                </div>
            )}
            {genUrl && (
                <div className="approve-form__url">
                    <div>New URL:</div>
                    <div>
                        <span id="generated-url">{genUrl}</span>
                        <IconButton aria-label="copy" onClick={handleCopyGenUrl}>
                            <ContentCopyIcon />
                        </IconButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproveForm;
