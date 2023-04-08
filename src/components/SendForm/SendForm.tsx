import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { FormControl, IconButton, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import cn from "classnames";
import BN from "bn.js";
import axios from "axios";
import * as Sentry from "@sentry/browser";
import { fetchBalance } from "@wagmi/core";
import { useAccount, useContract, useContractWrite, useFeeData, useNetwork, useSigner, useSwitchNetwork } from "wagmi";

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
import { getShortAddress } from "../../utils/wallet";
import {
    beautifyTokenBalance,
    CUSTOM_TOKENS,
    fromHRToBN,
    getCovalentUrl,
    nativeTokensAddresses,
    toHRNumberFloat,
} from "../../utils/tokens";
import { generateUrl, getShortHash, handleCopyUrl } from "../../utils/urlGenerator";
import { ReactComponent as ArrowDownIcon } from "../../ui-kit/images/arrow-down.svg";
import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";
import Button from "../../ui-kit/components/Button/Button";
import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";
import CustomTokenMenuItem from "./supportComponents/CustomTokenMenuItem/CustomTokenMenuItem";
import { DispatchContext, StateContext } from "../../reducer/constants";
import { arrayUniqueByKey, sortByBalance, sortBySymbol } from "../../utils/array";
import { getTokens } from "../../utils/storage";
import { trackEvent } from "../../utils/events";
import { LoaderLine } from "../../ui-kit/components/LoaderLine";
import Twitter from "../Twitter";
import GenUrl from "../GenUrl";
import { useRequestToken } from "../../hooks/useRequestToken";
import { PageNotFound } from "../PageNotFound";
import { useCurrentTokenData } from "../../hooks/useCurrentTokenData";
import { GradientHref } from "../../ui-kit/components/GradientHref";
import GenUrlPopup from "../GenUrlPopup";
import CONTRACT_ERC20 from "../../contracts/ERC20.json";
import { useEns } from "../../hooks/useEns";

import "./SendForm.scss";
import { Actions } from "../../reducer";
import { rpcList } from "../../utils/rpc";
import { useGasPrice } from "../../hooks/useGasPrice";
import { useNetworkChange } from "../../hooks/useNetworkChange";

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

const MAX_APPROVE_TIMEOUT = 15000;

const SendForm = ({ onConnect }: ApproveFormProps) => {
    const { data: signer } = useSigner();
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
    const [isCancelApproveLoading, setIsCancelApproveLoading] = useState(false);
    const [isBalanceRequestLoading, setIsBalanceRequestLoading] = useState(false);
    const [trxHash, setTrxHash] = useState("");
    const [trxLink, setTrxLink] = useState("");
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [genUrl, setGenUrl] = useState<string>();
    const [allowance, setAllowance] = useState<string>();
    const { isEnsAddress, isEnsName, ensName, ensAddress, isEnsNameLoading, isAvvyNameLoading, isAvvyName, avvyName } =
        useEns(toAddress);

    const { requestTokenData, requestToken } = useRequestToken();
    const isDisabledByToken = requestTokenData && networkName !== requestTokenData.networkName;
    const hasRequestToken = !!requestTokenData;

    const currentToken = useCurrentTokenData(balances, selectedToken, requestTokenData);
    const currentTokenContract = useContract({
        address: currentToken?.token_address,
        abi: CONTRACT_ERC20,
        signerOrProvider: signer,
    });
    const { writeAsync: approve } = useContractWrite({
        mode: "recklesslyUnprepared",
        address: currentToken?.token_address as `0x${string}`,
        abi: CONTRACT_ERC20,
        chainId: chain?.id,
        functionName: "approve",
    });
    const gasPrice = useGasPrice(chain?.id);

    useEffect(() => {
        trackEvent("openSendPage", { address, location: window.location.href });
    }, [address]);

    useEffect(() => {
        if (hasRequestToken && currentToken) {
            setBalances([currentToken]);
        }
    }, [hasRequestToken, currentToken]);

    useEffect(() => {
        if (requestTokenData && dispatch) {
            dispatch({ type: Actions.SetUISelectedChainId, payload: +networkToId[requestTokenData.networkName] });
            changeNetworkAtMetamask(requestTokenData.networkName);
            setValue(requestTokenData.value);
            setToAddress(requestTokenData.to);
            setSelectedToken(requestTokenData.token);
        }
    }, [requestToken, dispatch]);

    const currentTokenBalance = currentToken
        ? toHRNumberFloat(new BN(currentToken.balance), +currentToken.decimals)
        : 0;
    const hasAllowance = !!(allowance && allowance !== "0");

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

            const tokens = [
                ...CUSTOM_TOKENS[networkName as NetworkType],
                ...getTokens()
                    .filter((v) => v.chainId === chain.id)
                    .map((token) => ({
                        address: token.address,
                        id: token.name,
                        symbol: token.symbol,
                        decimals: token.decimals,
                    })),
            ];
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

    const cancelApprove = async () => {
        if (!networkName || !currentTokenContract || !approve) {
            addErrorNotification("Error", "No network");
            return;
        }

        try {
            setIsCancelApproveLoading(true);
            const tx = await approve({
                recklesslySetUnpreparedArgs: [ensAddress, "0"],
                recklesslySetUnpreparedOverrides: { gasPrice },
            });
            const symbol = await currentTokenContract.symbol();
            await tx.wait();

            addSuccessNotification("Success", "Cancel allowance completed");
            // eslint-disable-next-line max-len
            // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
            trackEvent("APPROVED_REVOKE_SENT", {
                location: window.location.href,
                source: "Send Page",
                chainId: networkToId[networkName],
                txHash: tx.hash,
                fromAddress: address,
                toAddress,
                tokenAddress: currentToken?.token_address,
                tokenSymbol: symbol,
            });
            setAllowance(undefined);
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

    const handleApprove = async () => {
        if (currentToken && approve && value && toAddress && address && networkName) {
            setGenUrl(undefined);
            setTrxHash("");
            setTrxLink("");
            setIsApproveLoading(true);

            const valueBN = fromHRToBN(value, +currentToken.decimals).toString();
            // In case of work with gnosis-safe via WalletConnect
            const timer = setTimeout(() => {
                if (connector?.name.toLowerCase() === "walletconnect") {
                    updateGenUrl();
                    setIsApproveLoading(false);
                }
            }, MAX_APPROVE_TIMEOUT);
            try {
                const tx = await approve({
                    recklesslySetUnpreparedArgs: [ensAddress, valueBN],
                    recklesslySetUnpreparedOverrides: { gasPrice },
                });
                setTrxHash(tx.hash);
                setTrxLink(getTrxHashLink(tx.hash, networkName));
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
                    setTrxHash(replacedHash);
                    setTrxLink(getTrxHashLink(replacedHash, networkName));
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

    const handleMaxClick = () => {
        if (requestTokenData?.value) {
            return;
        }
        setValue(+currentTokenBalance);
    };

    const setAllowanceAsync = async () => {
        if (address && currentToken && currentTokenContract && ensAddress) {
            const tokenContract = new rpcList[networkName].eth.Contract(
                CONTRACT_ERC20 as any,
                currentToken?.token_address
            );

            const allowanceFromContract = await tokenContract.methods.allowance(address, ensAddress).call();
            setAllowance(allowanceFromContract.toString());
        } else {
            setAllowance(undefined);
        }
    };

    useEffect(() => {
        setAllowanceAsync();
    }, [address, ensAddress, currentToken]);

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

                        <div className="send-form__label">
                            Recipient address
                            <span className="send-form__label-additional">
                                {(isEnsName || isAvvyName) && ensAddress && ` (${getShortAddress(ensAddress)})`}
                            </span>
                            <span className="send-form__label-additional">
                                {isEnsAddress && ensName && ` (${ensName})`}
                                {isEnsAddress && avvyName && ` (${avvyName})`}
                            </span>
                        </div>
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
                                disabled={isCancelApproveLoading || !ensAddress}
                            >
                                {isCancelApproveLoading ? "Loading..." : "Cancel Approve"}
                            </Button>
                        </div>
                    )}

                    {address ? (
                        <Button
                            onClick={handleApprove}
                            className="send-form__button"
                            disabled={
                                !value ||
                                !selectedToken ||
                                !ensAddress ||
                                isApproveLoading ||
                                hasAllowance ||
                                isDisabledByToken
                            }
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
                    {toAddress && !isEnsAddress && !isEnsName && !isAvvyName && (
                        <div className="send-form__error">Please write correct recipient address</div>
                    )}
                    {isEnsNameLoading && <div className="send-form__warning">ENS resolve in progress</div>}
                    {isAvvyNameLoading && <div className="send-form__warning">AVAX resolve in progress</div>}
                    {isEnsName && !ensAddress && !isEnsNameLoading && (
                        <div className="send-form__error">Can't resolve ENS address</div>
                    )}
                    {isAvvyName && !ensAddress && !isAvvyNameLoading && (
                        <div className="send-form__error">Can't resolve AVAX address</div>
                    )}
                </div>
            </div>
            <GenUrlPopup genUrl={genUrl} />
            <Twitter />
        </>
    );
};

export default SendForm;
