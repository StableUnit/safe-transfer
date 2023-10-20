import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { FormControl, IconButton, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import cn from "classnames";
import BN from "bn.js";
import axios from "axios";
import * as Sentry from "@sentry/browser";
import { fetchBalance } from "@wagmi/core";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import {
    changeNetworkAtMetamask,
    getAddressLink,
    getTrxHashLink,
    idToNetwork,
    networkInfo,
    networkNames,
    networkToId,
    NetworkType,
} from "../../utils/network";
import {
    beautifyTokenBalance,
    CUSTOM_TOKENS,
    fromHRToBN,
    getCovalentUrl,
    getTokenLogo,
    nativeTokensAddresses,
    toHRNumberFloat,
} from "../../utils/tokens";
import { generateUrl, getShortHash, handleCopyUrl } from "../../utils/urlGenerator";
import { ReactComponent as ArrowDownIcon } from "../../ui-kit/images/arrow-down.svg";
import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";
import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";
import CustomTokenMenuItem from "./supportComponents/CustomTokenMenuItem/CustomTokenMenuItem";
import { DispatchContext, StateContext } from "../../reducer/constants";
import { arrayUniqueByKey, sortByBalance, sortBySymbol } from "../../utils/array";
import { getChainCustomTokens } from "../../utils/storage";
import { trackEvent } from "../../utils/events";
import { LoaderLine } from "../../ui-kit/components/LoaderLine";
import Twitter from "../Twitter";
import GenUrl from "../GenUrl";
import { useRequestToken } from "../../hooks/useRequestToken";
import { PageNotFound } from "../PageNotFound";
import { useCurrentTokenData } from "../../hooks/useCurrentTokenData";
import { GradientHref } from "../../ui-kit/components/GradientHref";
import GenUrlPopup from "../GenUrlPopup";
import { useEns } from "../../hooks/useEns";
import { Actions } from "../../reducer";
import { useGasPrice } from "../../hooks/useGasPrice";
import SendFormRecipient from "./supportComponents/SendFormRecipient";
import AllowanceChecker from "./supportComponents/AllowanceChecker";
import SendFormButton from "./supportComponents/SendFormButton";
import SendFormError from "./supportComponents/SendFormError";
import { useErc20Write } from "../../hooks/useErc20Write";
import { BalanceType } from "../../utils/types";

import "./SendForm.scss";

interface ApproveFormProps {
    onConnect: () => void;
}

const MAX_APPROVE_TIMEOUT = 15000;

const SendForm = ({ onConnect }: ApproveFormProps) => {
    const { address, connector } = useAccount();
    const { chain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();
    const { newCustomToken, uiSelectedChainId } = useContext(StateContext);
    const networkName = chain?.id ? idToNetwork[chain?.id] : idToNetwork[uiSelectedChainId];
    const dispatch = useContext(DispatchContext);
    const [toAddress, setToAddress] = useState<string>();
    const [value, setValue] = useState<number>();
    const [selectedToken, setSelectedToken] = useState<string>(); // address
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [isTransferLoading, setIsTransferLoading] = useState(false);
    const [isTransferDone, setIsTransferDone] = useState(false);
    const [isBalanceRequestLoading, setIsBalanceRequestLoading] = useState(false);
    const [trxHash, setTrxHash] = useState("");
    const [trxLink, setTrxLink] = useState("");
    const [hasAllowance, setHasAllowance] = useState(false);
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [genUrl, setGenUrl] = useState<string>();
    const { ensAddress } = useEns(toAddress);

    const { requestTokenData, requestToken } = useRequestToken();
    const isDisabledByToken = requestTokenData && networkName !== requestTokenData.networkName;
    const hasRequestToken = !!requestTokenData;

    const currentToken = useCurrentTokenData(balances, selectedToken, requestTokenData);
    const approve = useErc20Write(currentToken?.token_address, "approve");
    const transfer = useErc20Write(currentToken?.token_address, "transfer");
    const gasPrice = useGasPrice(chain?.id);

    useEffect(() => {
        trackEvent("openSendPage", { address, location: window.location.href });
    }, [address]);

    useEffect(() => {
        if (requestTokenData && currentToken) {
            setBalances([
                { ...currentToken, logo: getTokenLogo(requestTokenData.networkName, requestTokenData.token) },
            ]);
        }
    }, [hasRequestToken, currentToken]);

    useEffect(() => {
        if (requestTokenData && dispatch) {
            dispatch({ type: Actions.SetUISelectedChainId, payload: +networkToId[requestTokenData.networkName] });
            if (chain?.id) {
                changeNetworkAtMetamask(requestTokenData.networkName);
            }
            setValue(requestTokenData.value);
            setToAddress(requestTokenData.to);
            setSelectedToken(requestTokenData.token);
        }
    }, [requestToken, dispatch, chain]);

    const currentTokenBalance = currentToken
        ? toHRNumberFloat(new BN(currentToken.balance), +currentToken.decimals)
        : 0;

    const onMount = async () => {
        if (chain && address && !requestTokenData?.token) {
            let longRequestTimeoutId;
            try {
                setIsBalanceRequestLoading(true);
                longRequestTimeoutId = setTimeout(() => {
                    Sentry.captureMessage("Long Covalent request");
                }, 10000);

                const response = await axios.get(getCovalentUrl(chain.id, address));
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
                    .filter((v: BalanceType) => v.balance !== "0")
                    .filter(
                        (v: BalanceType) => !nativeTokensAddresses.includes(v.token_address?.toLowerCase())
                    ) as BalanceType[];
                setBalances(sortBySymbol(result));
            } catch (e: any) {
                setIsBalanceRequestLoading(false);
                clearTimeout(longRequestTimeoutId);
                setBalances([]);
                Sentry.captureMessage(`Catch Covalent error: ${e?.message?.toString()}`);
            }

            const tokens = [...CUSTOM_TOKENS[networkName as NetworkType], ...getChainCustomTokens(chain.id)];
            for (const token of tokens) {
                try {
                    // @ts-ignore
                    const balance = await fetchBalance({ address, chainId: chain.id, token: token.address });
                    if (balance?.value?.gt(0)) {
                        const newTokenBalance = {
                            token_address: token.address,
                            name: token.id,
                            symbol: token.symbol,
                            decimals: token.decimals ?? balance.decimals,
                            balance: balance.value.toString(),
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
                    }
                    // eslint-disable-next-line no-empty
                } catch (e: any) {}
            }
        }
    };

    useEffect(() => {
        if (newCustomToken && newCustomToken?.chainId === chain?.id) {
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
    }, [networkName, address, requestToken]);

    const handleNetworkChange = useCallback(
        async (event) => {
            // @ts-ignore
            const chainId = +networkToId[event.target.value];
            if (switchNetworkAsync && connector?.switchChain) {
                try {
                    await connector.switchChain(chainId);
                    dispatch({ type: Actions.SetUISelectedChainId, payload: chainId });
                    trackEvent("NetworkChanged", { address, network: event.target.value });
                } catch (e: any) {
                    try {
                        // if user not rejected the request (https://eips.ethereum.org/EIPS/eip-1193#error-standards)
                        if (e.code !== 4001) {
                            await window.ethereum.request({
                                method: "wallet_addEthereumChain",
                                params: [networkInfo[event.target.value]],
                            });
                            trackEvent("NetworkAdded", { address, network: event.target.value });
                        }
                    } catch (addError) {
                        console.error(addError);
                    }
                }
            } else {
                dispatch({ type: Actions.SetUISelectedChainId, payload: chainId });
            }
        },
        [switchNetworkAsync, address]
    );

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToAddress(event.target.value);
    };

    const handleTokenChange = (event: SelectChangeEvent) => {
        setSelectedToken(event.target.value);
        trackEvent("TokenChanged", { address, token: event.target.value });
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

    const getTokenName = (tokenAddress?: string) => {
        return balances.find((v) => v.token_address === tokenAddress)?.symbol ?? tokenAddress;
    };

    const updateGenUrl = () => {
        if (currentToken && value && address && networkName) {
            setGenUrl(
                generateUrl({
                    address: currentToken?.token_address,
                    from: address ?? "",
                    to: ensAddress ?? "",
                    value: fromHRToBN(value ?? 0, +currentToken.decimals).toString(),
                    chain: networkName,
                })
            );
        }
    };

    const updateTrx = (hash?: string) => {
        setTrxHash(hash ?? "");
        setTrxLink(hash ? getTrxHashLink(hash, networkName) : "");
    };

    const handleApprove = async () => {
        if (currentToken && approve && value && toAddress && address && networkName) {
            setGenUrl(undefined);
            updateTrx("");
            setIsApproveLoading(true);

            const valueBN = fromHRToBN(value, +currentToken.decimals).toString();
            // In case of work with gnosis-safe via WalletConnect
            const timer = setTimeout(() => {
                if (["walletconnect", "walletconnectlegacy"].includes(connector?.name.toLowerCase() ?? "")) {
                    updateGenUrl();
                    setIsApproveLoading(false);
                }
            }, MAX_APPROVE_TIMEOUT);
            try {
                const tx = await approve({
                    recklesslySetUnpreparedArgs: [ensAddress, valueBN],
                    recklesslySetUnpreparedOverrides: { gasPrice },
                });
                updateTrx(tx.hash);
                clearTimeout(timer);
                updateGenUrl();
                // eslint-disable-next-line max-len
                // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
                trackEvent("APPROVE_SENT", {
                    location: window.location.href,
                    chainId: networkToId[networkName],
                    txHash: tx.hash,
                    fromAddress: address,
                    toAddress: ensAddress,
                    tokenAddress: currentToken?.token_address,
                    tokenSymbol: getTokenName(selectedToken),
                    tokenAmount: value,
                });
                await tx.wait();
                onSuccessApprove();
            } catch (error) {
                // @ts-ignore
                const replacedHash = error?.replacement?.hash;
                if (replacedHash) {
                    updateTrx(replacedHash);
                    onSuccessApprove();
                } else {
                    console.error(error);
                    addErrorNotification("Error", "Approve transaction failed");
                    setIsApproveLoading(false);
                    clearTimeout(timer);
                    setGenUrl(undefined);
                }
            }
        }
    };

    const handleTransfer = async () => {
        if (transfer && hasRequestToken && value && currentToken) {
            setIsTransferDone(false);
            setIsTransferLoading(true);
            const valueBN = fromHRToBN(value, +currentToken.decimals).toString();

            try {
                const tx = await transfer({
                    recklesslySetUnpreparedArgs: [ensAddress, valueBN],
                    recklesslySetUnpreparedOverrides: { gasPrice },
                });
                updateTrx(tx.hash);
                // eslint-disable-next-line max-len
                // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
                trackEvent("TRANSFER_SENT", {
                    location: window.location.href,
                    chainId: networkToId[networkName],
                    txHash: tx.hash,
                    fromAddress: address,
                    toAddress: ensAddress,
                    tokenAddress: currentToken?.token_address,
                    tokenSymbol: getTokenName(selectedToken),
                    tokenAmount: value,
                });
                await tx.wait();
                addSuccessNotification("Success", "Transfer transaction completed");
                setIsTransferLoading(false);
                setIsTransferDone(true);
            } catch (error) {
                // @ts-ignore
                const replacedHash = error?.replacement?.hash;
                if (replacedHash) {
                    updateTrx(replacedHash);
                    addSuccessNotification("Success", "Transfer transaction completed");
                } else {
                    console.error(error);
                    updateTrx("");
                    addErrorNotification("Error", "Transfer transaction failed");
                }
                setIsTransferLoading(false);
            }
        }
    };

    const handleMaxClick = () => {
        if (requestTokenData?.value) {
            return;
        }
        setValue(+currentTokenBalance);
    };

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

                        <SendFormRecipient toAddress={toAddress} />
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
                                            <img
                                                className="send-form__token-form__logo"
                                                src={token.logo ?? "/default.svg"}
                                                onError={({ currentTarget }) => {
                                                    // eslint-disable-next-line no-param-reassign
                                                    currentTarget.onerror = null; // prevents looping
                                                    // eslint-disable-next-line no-param-reassign
                                                    currentTarget.src = "/default.svg";
                                                }}
                                            />
                                            <div className="send-form__token-form__symbol">{token.symbol}</div>
                                            <div className="send-form__token-form__balance">
                                                {beautifyTokenBalance(token.balance, +token.decimals)}
                                            </div>
                                        </MenuItem>
                                    ))}
                                    {networkName && <CustomTokenMenuItem />}
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
                        {currentToken && networkName && (
                            <GradientHref
                                isExternal
                                target="_blank"
                                href={getAddressLink(currentToken.token_address, networkName)}
                                className="send-form__token-name"
                            >
                                {currentToken.name}
                            </GradientHref>
                        )}
                    </div>

                    <AllowanceChecker
                        ensAddress={ensAddress}
                        onHasAllowanceChange={(v) => setHasAllowance(v)}
                        currentToken={currentToken}
                    />

                    <SendFormButton
                        disabled={
                            !value ||
                            !selectedToken ||
                            !ensAddress ||
                            isApproveLoading ||
                            isTransferLoading ||
                            hasAllowance ||
                            new BN(currentToken?.balance ?? 0).eqn(0) ||
                            isTransferDone ||
                            isDisabledByToken
                        }
                        onConnect={onConnect}
                        onApprove={handleApprove}
                        isApproveLoading={isApproveLoading}
                        onTransfer={handleTransfer}
                        isTransferLoading={isTransferLoading}
                        isTransferDone={isTransferDone}
                    />
                    <SendFormError toAddress={toAddress} networkName={networkName} />
                </div>
            </div>
            <GenUrlPopup genUrl={genUrl} />
            <Twitter />
        </>
    );
};

export default SendForm;
