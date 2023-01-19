import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FormControl, IconButton, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import cn from "classnames";
import BN from "bn.js";
import axios from "axios";
import * as Sentry from "@sentry/browser";

import { changeNetworkAtMetamask, NetworkType, getTrxHashLink, idToNetwork, networkNames } from "../../utils/network";
import { ensToAddress, isAddress } from "../../utils/wallet";
import {
    beautifyTokenBalance,
    CUSTOM_TOKENS,
    fromHRToBN,
    getCovalentUrl,
    getTokenContractFactory,
    toHRNumberFloat,
} from "../../utils/tokens";
import { generateUrl, getShortHash, handleCopyUrl } from "../../utils/urlGenerator";
import { ReactComponent as ArrowDownIcon } from "../../ui-kit/images/arrow-down.svg";
import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";
import Button from "../../ui-kit/components/Button/Button";
import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";
import CustomTokenMenuItem from "./supportComponents/CustomTokenMenuItem/CustomTokenMenuItem";
import { StateContext } from "../../reducer/constants";
import { arrayUniqueByKey, sortByBalance, sortBySymbol } from "../../utils/array";
import { getTokens } from "../../utils/storage";
import { trackEvent } from "../../utils/events";
import { LoaderLine } from "../../ui-kit/components/LoaderLine";
import Twitter from "../Twitter";
import GenUrl from "../GenUrl";
import { useRequestToken } from "../../hooks/useRequestToken";
import { PageNotFound } from "../PageNotFound";
import { useCurrentTokenData } from "../../hooks/useCurrentTokenData";

import "./SendForm.scss";

export type BalanceType = {
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
    onConnect: () => void;
}

const SendForm = ({ onConnect }: ApproveFormProps) => {
    const { address, chainId, web3, newCustomToken } = useContext(StateContext);
    const networkName = chainId ? idToNetwork[chainId] : undefined;
    const [toAddress, setToAddress] = useState<string>();
    const [value, setValue] = useState<number>();
    const [selectedToken, setSelectedToken] = useState<string>(); // address
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [isCancelApproveLoading, setIsCancelApproveLoading] = useState(false);
    const [isBalanceRequestLoading, setIsBalanceRequestLoading] = useState(false);
    const [trxHash, setTrxHash] = useState("");
    const [trxLink, setTrxLink] = useState("");
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [genUrl, setGenUrl] = useState<string>();
    const [allowance, setAllowance] = useState<string>();

    const { requestTokenData, requestToken } = useRequestToken();
    const isDisabledByToken = requestTokenData && networkName !== requestTokenData.networkName;
    const hasRequestToken = !!requestTokenData;

    const currentToken = useCurrentTokenData(balances, selectedToken, requestTokenData);

    useEffect(() => {
        if (hasRequestToken && currentToken) {
            setBalances([currentToken]);
        }
    }, [hasRequestToken, currentToken]);

    useEffect(() => {
        if (requestTokenData) {
            changeNetworkAtMetamask(requestTokenData.networkName);
            setValue(requestTokenData.value);
            setToAddress(requestTokenData.to);
            setSelectedToken(requestTokenData.token);
        }
    }, [requestToken]);

    const isCorrectData = isAddress(toAddress) && (value ?? 0) > 0 && selectedToken;
    const currentTokenBalance = currentToken
        ? toHRNumberFloat(new BN(currentToken.balance), +currentToken.decimals)
        : 0;
    const hasAllowance = !!(allowance && allowance !== "0");

    const getTokenContract = getTokenContractFactory(web3);

    const onMount = async () => {
        if (chainId && address && web3 && !requestTokenData?.token) {
            let longRequestTimeoutId;
            try {
                setIsBalanceRequestLoading(true);
                longRequestTimeoutId = setTimeout(() => {
                    Sentry.captureMessage("Long Covalent request");
                }, 10000);

                const response = await axios.get(getCovalentUrl(chainId, address));
                clearTimeout(longRequestTimeoutId);
                setIsBalanceRequestLoading(false);

                const result = response.data.data.items
                    .map((v: Record<string, string>) => ({
                        token_address: v.contract_address,
                        name: v.contract_name,
                        symbol: v.contract_ticker_symbol,
                        logo: v.logo_url,
                        decimals: v.contract_decimals,
                        balance: v.balance,
                    }))
                    .filter((v: BalanceType) => v.balance !== "0") as BalanceType[];
                setBalances(sortBySymbol(result));
            } catch (e: any) {
                setIsBalanceRequestLoading(false);
                clearTimeout(longRequestTimeoutId);
                setBalances([]);
                Sentry.captureMessage(`Catch Covalent error: ${e?.message?.toString()}`);
            }

            const tokens = [
                ...CUSTOM_TOKENS[networkName as NetworkType],
                ...getTokens().map((token) => ({
                    address: token.address,
                    id: token.name,
                    symbol: token.symbol,
                    decimals: token.decimals,
                })),
            ];
            for (const token of tokens) {
                const tokenContract = getTokenContract(token.address);
                if (!tokenContract) {
                    return;
                }

                try {
                    const balance = await tokenContract.methods.balanceOf(address.toLowerCase()).call();

                    const newTokenBalance = {
                        token_address: token.address,
                        name: token.id,
                        symbol: token.symbol,
                        decimals: token.decimals,
                        balance,
                    } as BalanceType;
                    setBalances((oldBalances) => {
                        const newBalances = arrayUniqueByKey(
                            [...oldBalances, newTokenBalance].map((v) => ({
                                ...v,
                                token_address: v.token_address.toLowerCase(),
                            })),
                            "token_address"
                        );
                        return sortByBalance(newBalances);
                    });
                    // eslint-disable-next-line no-empty
                } catch (e: any) {}
            }
        }
    };

    useEffect(() => {
        if (newCustomToken) {
            const newTokenBalance = {
                token_address: newCustomToken.address,
                name: newCustomToken.name,
                symbol: newCustomToken.symbol,
                decimals: newCustomToken.decimals,
                balance: newCustomToken.balance,
            } as BalanceType;
            setBalances((oldBalances) => {
                const hasToken = !!oldBalances.find(
                    (oldBalance) => oldBalance.token_address === newTokenBalance.token_address
                );

                return hasToken ? oldBalances : sortByBalance([...oldBalances, newTokenBalance]);
            });
        }
    }, [newCustomToken]);

    useEffect(() => {
        onMount();
    }, [chainId, address, web3, requestToken]);

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
        if (event.target.value === "") {
            setValue(undefined);
        } else {
            setValue(+event.target.value);
        }
    };

    const onSuccessApprove = () => {
        if (genUrl) {
            return;
        }

        if (!networkName) {
            addErrorNotification("Error", "No network");
            setIsApproveLoading(false);
            return;
        }

        addSuccessNotification("Success", "Approve transaction completed");
        setIsApproveLoading(false);
    };

    const cancelApprove = async () => {
        const tokenContract = getTokenContract(currentToken?.token_address ?? "");
        if (!tokenContract || !web3) {
            addErrorNotification("Error", "No network");
            return;
        }

        try {
            setIsCancelApproveLoading(true);
            await tokenContract.methods
                .approve(await ensToAddress(toAddress), "0")
                .send({ from: address, maxPriorityFeePerGas: null, maxFeePerGas: null });
            setAllowance(undefined);

            const symbol = await tokenContract.methods.symbol().call();
            // eslint-disable-next-line max-len
            // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
            trackEvent("CANCEL_ALLOWANCE", {
                source: "Send Page",
                symbol,
                to: toAddress,
                from: address,
                networkName,
            });
        } catch (error) {
            // @ts-ignore
            const replacedHash = error?.replacement?.hash;
            if (replacedHash) {
                setAllowance(undefined);
            } else {
                console.error(error);
                addErrorNotification("Error", "Cancel approve transaction failed");
            }
            setIsCancelApproveLoading(false);
        }
    };

    const getTokenName = (tokenAddress?: string) => {
        return balances.find((v) => v.token_address === tokenAddress)?.symbol ?? tokenAddress;
    };

    const handleApprove = async () => {
        if (currentToken && value && toAddress && address && web3 && networkName) {
            setGenUrl(undefined);
            setTrxHash("");
            setTrxLink("");
            setIsApproveLoading(true);

            const valueBN = fromHRToBN(value, +currentToken.decimals).toString();
            const tokenContract = getTokenContract(currentToken.token_address);
            const ensAddress = await ensToAddress(toAddress);
            let timeoutId;

            try {
                await tokenContract?.methods
                    .approve(ensAddress, valueBN)
                    .send({ from: address, maxPriorityFeePerGas: null, maxFeePerGas: null })
                    .on("transactionHash", (hash: string) => {
                        setTrxHash(hash);
                        setTrxLink(getTrxHashLink(hash, networkName));
                        setGenUrl(
                            generateUrl({
                                address: currentToken?.token_address,
                                from: address ?? "",
                                to: toAddress ?? "",
                                value: fromHRToBN(value ?? 0, +currentToken.decimals).toString(),
                                chain: networkName,
                            })
                        );
                        // eslint-disable-next-line max-len
                        // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
                        trackEvent("APPROVE_LINK_GENERATED", {
                            fromAddress: address,
                            networkName,
                            value,
                            currency: getTokenName(selectedToken),
                        });
                        timeoutId = setTimeout(() => {
                            // eslint-disable-next-line max-len
                            // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
                            trackEvent("APPROVE_FINISHED", {
                                fromAddress: address,
                                networkName,
                                value,
                                currency: getTokenName(selectedToken),
                            });
                            onSuccessApprove();
                        }, 20000);
                    });
                // eslint-disable-next-line max-len
                // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
                trackEvent("APPROVE_FINISHED", {
                    fromAddress: address,
                    networkName,
                    value,
                    currency: getTokenName(selectedToken),
                });
                onSuccessApprove();
                clearTimeout(timeoutId);
            } catch (error) {
                clearTimeout(timeoutId);
                // @ts-ignore
                const replacedHash = error?.replacement?.hash;
                if (replacedHash) {
                    setTrxHash(replacedHash);
                    setTrxLink(getTrxHashLink(replacedHash, networkName));
                    onSuccessApprove();
                } else {
                    console.error(error);
                    addErrorNotification("Error", "Approve transaction failed");
                    setIsApproveLoading(false);
                }
            }
        }
    };

    const handleMaxClick = () => {
        if (requestTokenData?.value) {
            return;
        }
        setValue(+currentTokenBalance);
        trackEvent("MAX_CLICK", {});
    };

    const setAllowanceAsync = async () => {
        if (isCorrectData && currentToken) {
            const tokenContract = getTokenContract(currentToken.token_address);
            if (tokenContract) {
                const allowanceFromContract = await tokenContract.methods
                    .allowance(address, await ensToAddress(toAddress))
                    .call();
                setAllowance(allowanceFromContract.toString());
            }
        } else {
            setAllowance(undefined);
        }
    };

    useEffect(() => {
        setAllowanceAsync();
    }, [isCorrectData]);

    if (requestToken && !requestTokenData) {
        return <PageNotFound />;
    }

    return (
        <>
            <div className="send-form__container">
                {trxHash && (
                    <div className="send-form__hash">
                        <div className="send-form__hash__text">
                            <div>Hash:&nbsp;&nbsp;</div>
                            <div id="generated-url">
                                <a href={trxLink} target="_blank" rel="noreferrer">
                                    {getShortHash(trxHash)}
                                </a>
                            </div>
                        </div>
                        <IconButton aria-label="copy" onClick={handleCopyUrl(trxHash)}>
                            <ContentCopyIcon />
                        </IconButton>
                    </div>
                )}
                <GenUrl isLoading={isApproveLoading} genUrl={genUrl} text="Link to receive:" />
                <div className={cn("send-form", { "send-form--disabled": !address })}>
                    <div className="send-form__title">Send</div>

                    <div className="send-form__content">
                        <div className="send-form__label">Network</div>
                        <FormControl className="send-form__network-form">
                            <Select
                                value={networkName || "placeholder-value"}
                                onChange={handleNetworkChange}
                                inputProps={{ "aria-label": "Without label" }}
                                IconComponent={ArrowDownIcon}
                                MenuProps={{ classes: { paper: "send-form__paper", list: "send-form__list" } }}
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

                        <div className="send-form__label">Recipient address</div>
                        <TextField
                            value={toAddress}
                            disabled={hasRequestToken}
                            id="address"
                            className="send-form__address"
                            placeholder="Paste address here ..."
                            variant="outlined"
                            onChange={handleAddressChange}
                        />

                        <div className="send-form__content__line">
                            <div className="send-form__label">Balance: {currentTokenBalance}</div>
                            <div className="send-form__max-button" onClick={handleMaxClick}>
                                MAX
                            </div>
                        </div>

                        <div className="send-form__content__line">
                            <FormControl className="send-form__token-form">
                                <Select
                                    disabled={!!requestTokenData?.token}
                                    value={selectedToken || "placeholder-value" || "custom-value"}
                                    onChange={handleTokenChange}
                                    inputProps={{ "aria-label": "Without label" }}
                                    IconComponent={ArrowDownIcon}
                                    MenuProps={{
                                        classes: {
                                            root: "send-form__token-dropdown",
                                            paper: "send-form__paper",
                                            list: "send-form__list",
                                        },
                                    }}
                                >
                                    <MenuItem disabled value="placeholder-value">
                                        Select token
                                    </MenuItem>
                                    {isBalanceRequestLoading && (
                                        <LoaderLine className="send-form__token-form__loader" width={150} height={24} />
                                    )}
                                    {balances.map((token) => (
                                        <MenuItem key={token.token_address} value={token.token_address}>
                                            <div className="send-form__token-form__symbol">{token.symbol}</div>
                                            <div className="send-form__token-form__balance">
                                                {beautifyTokenBalance(token.balance, +token.decimals)}
                                            </div>
                                        </MenuItem>
                                    ))}
                                    {networkName && <CustomTokenMenuItem networkName={networkName} />}
                                </Select>
                            </FormControl>

                            <TextField
                                disabled={!!requestTokenData?.value}
                                id="value"
                                className="send-form__value"
                                placeholder="0.00"
                                type="number"
                                onChange={handleValueChange}
                                value={value?.toString()}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>

                    {hasAllowance && currentToken && (
                        <div className="send-form__allowance">
                            <div className="send-form__allowance__text">
                                <span>Allowance for selected address is </span>
                                <span>
                                    {beautifyTokenBalance(allowance, +currentToken.decimals)} {currentToken.symbol}
                                </span>
                                <br />
                                Please cancel this approve.
                            </div>
                            <Button
                                onClick={cancelApprove}
                                className="send-form__button"
                                disabled={isCancelApproveLoading}
                            >
                                {isCancelApproveLoading ? "Loading..." : "Cancel Approve"}
                            </Button>
                        </div>
                    )}

                    {address ? (
                        <Button
                            onClick={handleApprove}
                            className="send-form__button"
                            disabled={!isCorrectData || isApproveLoading || hasAllowance || isDisabledByToken}
                        >
                            {isApproveLoading ? "Loading..." : "Approve"}
                        </Button>
                    ) : (
                        <Button onClick={onConnect} className="send-form__button">
                            CONNECT WALLET
                        </Button>
                    )}
                    {requestTokenData && requestTokenData.networkName !== networkName && (
                        <div className="send-form__error">Please change network to {requestTokenData.networkName}</div>
                    )}
                </div>
            </div>
            <Twitter />
        </>
    );
};

export default SendForm;
