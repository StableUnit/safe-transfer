import React, { useContext, useEffect, useState } from "react";
import cn from "classnames";
import Switch from "@mui/material/Switch";

import { useAccount, useContract, useContractWrite, useNetwork, useSigner } from "wagmi";
import { NetworkType, getAddressLink, idToNetwork, networkNames, networkToId } from "../../utils/network";
import { getShortHash, handleCopyUrl } from "../../utils/urlGenerator";
import {
    beautifyTokenBalance,
    getCustomTokenAllowance,
    getCustomTokenMetadata,
    getValue,
    TokenMetadataType,
} from "../../utils/tokens";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";
import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";
import { ReactComponent as MetamaskIcon } from "../../ui-kit/images/metamask.svg";
import Button from "../../ui-kit/components/Button/Button";
import { InfoCell } from "../InfoCell/InfoCell";
import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";
import RestoreForm from "../RestoreForm/RestoreForm";
import { ensToAddress } from "../../utils/wallet";
import { PageNotFound } from "../PageNotFound";
import { sendAddTransferEvent, trackEvent } from "../../utils/events";
import Twitter from "../Twitter";

import "../PageNotFound/styles.scss";
import "./ReceiveForm.scss";
import { useReceiveToken } from "../../hooks/useReceiveToken";
import CONTRACT_ERC20 from "../../contracts/ERC20.json";
import { Actions } from "../../reducer";
import { DispatchContext } from "../../reducer/constants";
import { useGasPrice } from "../../hooks/useGasPrice";
import ReceiveErrors from "./supportComponents/ReceiveErrors";
import ReceiveHash from "./supportComponents/ReceiveHash";

interface TransferFormProps {
    onConnect: () => void;
}

const ReceiveForm = React.memo(({ onConnect }: TransferFormProps) => {
    const dispatch = useContext(DispatchContext);
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [tokenMetadata, setTokenMetadata] = useState<undefined | TokenMetadataType>(undefined);
    const [isTransferFetching, setIsTransferFetching] = useState(false);
    const [isCancelFetching, setIsCancelFetching] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [trxHash, setTrxHash] = useState("");
    const [isShowDetailed, setIsShowDetailed] = useState(false);
    const [allowance, setAllowance] = useState<undefined | string>(undefined);
    const networkName = chain?.id ? idToNetwork[chain?.id] : undefined;

    useEffect(() => {
        trackEvent("openReceivePage", { address, location: window.location.href });
    }, [address]);

    const { tokenData, token } = useReceiveToken();

    const config = {
        mode: "recklesslyUnprepared" as "recklesslyUnprepared" | "prepared",
        address: tokenData?.address as `0x${string}`,
        abi: CONTRACT_ERC20,
        chainId: chain?.id,
    };
    const tokenDataContract = useContract({ ...config, signerOrProvider: signer });
    const { writeAsync: approve } = useContractWrite({ ...config, functionName: "approve" });
    const { writeAsync: transferFrom } = useContractWrite({ ...config, functionName: "transferFrom" });
    const gasPrice = useGasPrice(chain?.id);

    useEffect(() => {
        if (tokenData?.chain && dispatch) {
            dispatch({ type: Actions.SetUISelectedChainId, payload: +networkToId[tokenData.chain] });
        }
    }, [tokenData?.chain, dispatch]);

    const [isToAddressRequesting, setIsToAddressRequesting] = useState(false);
    const [toAddress, setToAddress] = useState<string | null>();

    const requestEns = async () => {
        if (tokenData?.to && !toAddress && networkName) {
            try {
                setIsToAddressRequesting(true);
                const newToAddress = await ensToAddress(tokenData.to);
                if (!newToAddress) {
                    addErrorNotification("Invalid ENS address");
                }
                setToAddress(newToAddress ?? tokenData.to);
                setIsToAddressRequesting(false);
            } catch (e: any) {
                setIsToAddressRequesting(false);
                addErrorNotification("Invalid ENS address");
                setToAddress(tokenData.to);
            }
        }
    };
    useEffect(() => {
        requestEns();
    }, [tokenData, networkName]);

    const updateTokenMetadata = async () => {
        if (tokenData && !tokenMetadata) {
            const newTokenMetadata = await getCustomTokenMetadata(tokenData.chain as NetworkType, tokenData.address);
            setTokenMetadata(newTokenMetadata);
            document.title = `Receive ${getValue(newTokenMetadata, tokenData)}`;
        }
    };
    useEffect(() => {
        updateTokenMetadata();
    }, [tokenData, tokenMetadata]);

    const updateAllowance = async () => {
        if (tokenData && toAddress) {
            const allowanceFromContract = await getCustomTokenAllowance(
                tokenData.chain as NetworkType,
                tokenData.address,
                tokenData.from,
                toAddress
            );
            setAllowance(allowanceFromContract);
        }
    };

    useEffect(() => {
        if (!allowance) {
            updateAllowance();
        }
    }, [tokenData, toAddress, allowance]);

    const handleTransfer = async () => {
        setIsTransferFetching(true);

        try {
            if (tokenData && transferFrom && networkName && toAddress) {
                const tx = await transferFrom({
                    recklesslySetUnpreparedArgs: [tokenData.from, toAddress, tokenData.value],
                    recklesslySetUnpreparedOverrides: { gasPrice },
                });
                setTrxHash(tx.hash);
                const eventData = {
                    location: window.location.href,
                    chainId: networkToId[networkName],
                    txHash: tx.hash,
                    fromAddress: tokenData.from,
                    toAddress,
                    tokenAddress: tokenData.address,
                    tokenSymbol: tokenMetadata?.symbol,
                    tokenAmount: getValue(tokenMetadata, tokenData),
                };
                sendAddTransferEvent(eventData);
                // eslint-disable-next-line max-len
                // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
                trackEvent("TRANSFER_FROM_SENT", eventData);

                await tx.wait();
                addSuccessNotification("Success", "Transfer from transaction completed");
                setIsSuccess(true);
                setIsTransferFetching(false);
                await updateAllowance();
            }
        } catch (e) {
            console.log(e);
            // @ts-ignore
            addErrorNotification("TransferFrom Error", e?.error?.message);
            setIsTransferFetching(false);
        }
    };

    const handleCancel = async () => {
        setIsCancelFetching(true);

        try {
            if (tokenData && tokenDataContract && approve && networkName && toAddress) {
                const tx = await approve({
                    recklesslySetUnpreparedArgs: [toAddress, "0"],
                    recklesslySetUnpreparedOverrides: { gasPrice },
                });
                const symbol = await tokenDataContract.symbol();

                // eslint-disable-next-line max-len
                // Disclaimer: since all data above are always public on blockchain, so there’s no compromise of privacy. Beware however, that underlying infrastructure on users, such as wallets or Infura might log sensitive data, such as IP addresses, device fingerprint and others.
                trackEvent("APPROVED_REVOKE_SENT", {
                    location: window.location.href,
                    source: "Receive Page",
                    chainId: networkToId[networkName],
                    txHash: tx.hash,
                    fromAddress: tokenData.from,
                    toAddress: tokenData.to,
                    tokenAddress: tokenData.address,
                    tokenSymbol: symbol,
                });

                await tx.wait();
                addSuccessNotification("Success", "Cancel allowance completed");
                setIsCancelFetching(false);
                await updateAllowance();
            }
        } catch (e) {
            console.log(e);
            // @ts-ignore
            addErrorNotification("Cancel Error", e?.error?.message);
            setIsCancelFetching(false);
        }
    };

    const handleAddToMetamask = async () => {
        if (tokenData?.address) {
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenData.address,
                        // metamask can't add tokens with symbol longer than 11 characters
                        symbol: tokenMetadata?.symbol.slice(0, 11),
                        decimals: tokenMetadata?.decimals,
                        image: tokenMetadata?.logo,
                    },
                },
            });
            trackEvent("METAMASK_TOKEN_ADD", {
                source: "Receive Page",
                symbol: tokenMetadata?.symbol,
                location: window.location.href,
            });
        }
    };

    const hasAllData =
        tokenData &&
        tokenData.chain &&
        tokenData.from &&
        tokenData.to &&
        tokenData.address &&
        tokenData.value?.length > 0 &&
        tokenData.value !== "0";

    const isDisabledContent =
        !address ||
        !toAddress ||
        toAddress?.toLowerCase() !== address.toLowerCase() ||
        tokenData?.chain !== networkName;

    const isReceiver = address && toAddress && toAddress.toLowerCase() === address.toLowerCase();
    const isSender = tokenData && address && tokenData.from.toLowerCase() === address.toLowerCase();

    if (token && !hasAllData) {
        return <PageNotFound />;
    }

    const renderButton = () => {
        if (isSuccess) {
            return null;
        }
        if (!address) {
            return (
                <Button onClick={onConnect} className="receive-form__button">
                    CONNECT WALLET
                </Button>
            );
        }

        if (isToAddressRequesting) {
            return (
                <Button disabled className="receive-form__button">
                    Loading...
                </Button>
            );
        }

        const hasAllowance = !!(allowance && allowance !== "0");

        return (
            <>
                {isSender && (
                    <Button
                        onClick={handleCancel}
                        className="receive-form__button"
                        disabled={!hasAllData || isCancelFetching || tokenData?.chain !== networkName || !hasAllowance}
                    >
                        {isCancelFetching ? "Loading..." : "Cancel"}
                    </Button>
                )}
                <Button
                    onClick={handleTransfer}
                    className="receive-form__button"
                    disabled={!hasAllData || isTransferFetching || isDisabledContent || !hasAllowance}
                >
                    {isTransferFetching ? "Loading..." : "Receive"}
                </Button>
            </>
        );
    };

    return (
        <>
            <div
                className={cn("receive-form", {
                    "receive-form--disabled": isDisabledContent,
                    "receive-form--detailed": isShowDetailed,
                })}
            >
                {token && (
                    <div className="receive-form__content">
                        <div className="receive-form__title">Receive</div>
                        <div className="receive-form__switch">
                            <Switch
                                size="small"
                                checked={isShowDetailed}
                                onChange={() => setIsShowDetailed((v) => !v)}
                                inputProps={{ "aria-label": "controlled" }}
                            />
                            <div className="receive-form__switch__title">Details</div>
                        </div>
                        {tokenData && (
                            <>
                                <InfoCell title="Network:">
                                    <NetworkImage network={tokenData.chain} width={24} height={24} />
                                    <div>
                                        &nbsp;&nbsp;{networkNames[tokenData.chain]}{" "}
                                        {isShowDetailed && `(id: ${networkToId[tokenData.chain]})`}
                                    </div>
                                </InfoCell>
                                <div className="receive-form__line" id="addresses">
                                    <InfoCell
                                        className="receive-form__copy-container"
                                        title="From:"
                                        bubble={isSender ? "You" : undefined}
                                    >
                                        <a href={getAddressLink(tokenData.from, tokenData.chain)} id="from">
                                            {isShowDetailed ? tokenData.from : getShortHash(tokenData.from)}
                                        </a>
                                        <div className="copy" onClick={handleCopyUrl(tokenData.from)}>
                                            <ContentCopyIcon />
                                        </div>
                                    </InfoCell>
                                    <InfoCell
                                        className="receive-form__copy-container"
                                        title="To:"
                                        bubble={isReceiver ? "You" : undefined}
                                    >
                                        <a href={getAddressLink(tokenData.to, tokenData.chain)} id="to">
                                            {tokenData.to.startsWith("0x") && !isShowDetailed
                                                ? getShortHash(tokenData.to)
                                                : tokenData.to}
                                        </a>
                                        <div className="copy" onClick={handleCopyUrl(tokenData.to)}>
                                            <ContentCopyIcon />
                                        </div>
                                    </InfoCell>
                                </div>
                                <InfoCell className="receive-form__token-address" title="Token address:">
                                    <a
                                        href={getAddressLink(tokenData.address, tokenData.chain)}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <div id="tokenAddress">
                                            {isShowDetailed ? tokenData.address : getShortHash(tokenData.address)}
                                        </div>
                                    </a>
                                    <div className="receive-form__token-address__buttons">
                                        <div className="receive-form__metamask" onClick={handleAddToMetamask}>
                                            {!isShowDetailed && <div>Add to&nbsp;</div>}
                                            <MetamaskIcon />
                                        </div>
                                        <div className="copy" onClick={handleCopyUrl(tokenData.address)}>
                                            <ContentCopyIcon />
                                        </div>
                                    </div>
                                </InfoCell>
                                <div className="receive-form__line">
                                    <InfoCell title="Approved value:">
                                        <div id="value">{getValue(tokenMetadata, tokenData)}</div>
                                    </InfoCell>
                                    {allowance !== undefined && tokenMetadata && (
                                        <InfoCell title="Current allowance:">
                                            <div id="allowance">
                                                {`${beautifyTokenBalance(allowance, +tokenMetadata.decimals)} ${
                                                    tokenMetadata?.symbol
                                                }`}
                                            </div>
                                        </InfoCell>
                                    )}
                                </div>
                                {renderButton()}
                                <ReceiveErrors toAddress={toAddress} />
                            </>
                        )}
                    </div>
                )}
                <ReceiveHash trxHash={trxHash} />
                {!tokenData && <RestoreForm onConnect={onConnect} />}
            </div>
            <Twitter />
        </>
    );
});

export default ReceiveForm;
