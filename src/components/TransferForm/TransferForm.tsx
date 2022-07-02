import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { useMoralisWeb3Api } from "react-moralis";
import Web3 from "web3";
import Moralis from "moralis";

import cn from "classnames";
import {
    CustomNetworkType,
    getAddressLink,
    getTrxHashLink,
    idToNetwork,
    isCustomNetwork,
    MoralisNetworkType,
    networkNames,
    networkToId,
} from "../../utils/network";
import { decodeToken, getShortHash, handleCopyUrl, TokenInfoType } from "../../utils/urlGenerator";
import {
    beautifyTokenBalance,
    getCustomTokenAllowance,
    getCustomTokenMetadata,
    TokenMetadataType,
} from "../../utils/tokens";
import { TRANSFER_FROM_ABI } from "../../contracts/abi";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";
import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";
import { ReactComponent as MetamaskIcon } from "../../ui-kit/images/metamask.svg";
import Button from "../../ui-kit/components/Button/Button";

import "./TransferForm.scss";
import { InfoCell } from "../InfoCell/InfoCell";
import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";
import useWalletData from "../../hooks/useWalletData";

interface TransferFormProps {
    token: string;
    onConnect: () => void;
}

const getValue = (tokenMetadata: TokenMetadataType | undefined, tokenData: TokenInfoType) =>
    tokenMetadata
        ? `${beautifyTokenBalance(tokenData.value, +tokenMetadata.decimals)} ${tokenMetadata.symbol}`
        : tokenData.value;

const TransferForm = React.memo(({ token, onConnect }: TransferFormProps) => {
    const { address, chainId } = useWalletData();
    const Web3Api = useMoralisWeb3Api();
    const [tokenMetadata, setTokenMetadata] = useState<undefined | TokenMetadataType>(undefined);
    const [isTransferFetching, setIsTransferFetching] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [trxHash, setTrxHash] = useState("");
    const [allowance, setAllowance] = useState<undefined | string>(undefined);
    const networkName = idToNetwork[chainId];
    const tokenData = decodeToken(token);

    const updateTokenMetadata = async () => {
        if (tokenData) {
            if (isCustomNetwork(tokenData.chain)) {
                const newTokenMetadata = await getCustomTokenMetadata(
                    tokenData.chain as CustomNetworkType,
                    tokenData.address
                );
                setTokenMetadata(newTokenMetadata);
                document.title = `Receive ${getValue(newTokenMetadata, tokenData)}`;
            } else {
                const options = {
                    chain: Web3.utils.numberToHex(networkToId[tokenData.chain]),
                    addresses: [tokenData.address],
                };
                // @ts-ignore
                const res = await Web3Api.token.getTokenMetadata(options);
                setTokenMetadata(res?.[0]);
                document.title = `Receive ${getValue(res?.[0], tokenData)}`;
            }
        }
    };

    const updateAllowance = async () => {
        if (tokenData) {
            if (isCustomNetwork(tokenData.chain)) {
                const allowanceFromContract = await getCustomTokenAllowance(
                    tokenData.chain as CustomNetworkType,
                    tokenData.address,
                    tokenData.from,
                    tokenData.to
                );
                setAllowance(allowanceFromContract);
            } else {
                const allowanceFromContract = await Web3Api.token.getTokenAllowance({
                    owner_address: tokenData.from,
                    spender_address: tokenData.to,
                    address: tokenData.address,
                    chain: tokenData.chain as MoralisNetworkType,
                });
                setAllowance(allowanceFromContract.allowance);
            }
        }
    };

    useEffect(() => {
        updateTokenMetadata();
        updateAllowance();
    }, [token, address]);

    const handleTransfer = async () => {
        setIsTransferFetching(true);

        try {
            if (tokenData) {
                const options = {
                    contractAddress: tokenData.address,
                    functionName: "transferFrom",
                    abi: TRANSFER_FROM_ABI,
                    params: { _from: tokenData.from, _to: tokenData.to, _value: tokenData.value },
                };
                const transaction = await Moralis.executeFunction(options);
                setTrxHash(transaction.hash);
                // @ts-ignore
                await transaction.wait();
                addSuccessNotification("Success", "Transfer from transaction completed");
                setIsSuccess(true);
                setIsTransferFetching(false);
            }
        } catch (e) {
            // @ts-ignore
            addErrorNotification("TransferFrom Error", e?.error?.message);
            setIsTransferFetching(false);
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
                        symbol: tokenMetadata?.symbol,
                        decimals: tokenMetadata?.decimals,
                        image: tokenMetadata?.logo,
                    },
                },
            });
        }
    };

    if (!tokenData) {
        return <div className="transfer-form">Invalid token</div>;
    }

    const hasAllData =
        tokenData.chain &&
        tokenData.from &&
        tokenData.to &&
        tokenData.address &&
        tokenData.value?.length > 0 &&
        tokenData.value !== "0";

    const isDisabledContent =
        !address || tokenData.to.toLowerCase() !== address.toLowerCase() || tokenData.chain !== networkName;

    const renderButton = () => {
        if (isSuccess) {
            return null;
        }
        if (!address) {
            return (
                <Button onClick={onConnect} className="transfer-form__button">
                    CONNECT WALLET
                </Button>
            );
        }

        const hasAllowance = !!(allowance && allowance !== "0");

        return (
            <Button
                onClick={handleTransfer}
                className="transfer-form__button"
                disabled={!hasAllData || isTransferFetching || isDisabledContent || !hasAllowance}
            >
                {isTransferFetching ? "Loading..." : "Receive"}
            </Button>
        );
    };

    return (
        <div className={cn("transfer-form", { "transfer-form--disabled": isDisabledContent })}>
            <div className="transfer-form__content">
                <div className="transfer-form__title">Receive</div>
                {tokenData && (
                    <>
                        <InfoCell title="Network:">
                            <NetworkImage network={tokenData.chain} width={24} height={24} />
                            <div>&nbsp;&nbsp;{networkNames[tokenData.chain]}</div>
                        </InfoCell>
                        <div className="transfer-form__line">
                            <InfoCell className="transfer-form__copy-container" title="From:">
                                <div id="from">{getShortHash(tokenData.from)}</div>
                                <div onClick={handleCopyUrl(tokenData.from)}>
                                    <ContentCopyIcon />
                                </div>
                            </InfoCell>
                            <InfoCell className="transfer-form__copy-container" title="To:">
                                <div id="to">
                                    {tokenData.to.startsWith("0x") ? getShortHash(tokenData.to) : tokenData.to}
                                </div>
                                <div onClick={handleCopyUrl(tokenData.to)}>
                                    <ContentCopyIcon />
                                </div>
                            </InfoCell>
                        </div>
                        <InfoCell className="transfer-form__token-address" title="Token address:">
                            <a
                                href={getAddressLink(tokenData.address, tokenData.chain)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <div id="tokenAddress">{getShortHash(tokenData.address)}</div>
                            </a>
                            <div className="transfer-form__token-address__buttons">
                                <div className="transfer-form__metamask" onClick={handleAddToMetamask}>
                                    <div>Add to&nbsp;</div>
                                    <MetamaskIcon />
                                </div>
                                <div onClick={handleCopyUrl(tokenData.address)}>
                                    <ContentCopyIcon />
                                </div>
                            </div>
                        </InfoCell>
                        <div className="transfer-form__line">
                            <InfoCell title="Value:">
                                <div id="value">{getValue(tokenMetadata, tokenData)}</div>
                            </InfoCell>
                            {allowance && tokenMetadata && (
                                <InfoCell title="Allowance:">
                                    <div id="allowance">
                                        {`${beautifyTokenBalance(allowance, +tokenMetadata.decimals)} ${
                                            tokenMetadata?.symbol
                                        }`}
                                    </div>
                                </InfoCell>
                            )}
                        </div>
                        {address && tokenData.to.toLowerCase() !== address?.toLowerCase() && (
                            <div className="transfer-form__error">
                                Please change account to{" "}
                                {tokenData.to.startsWith("0x") ? getShortHash(tokenData.to) : tokenData.to}
                            </div>
                        )}
                        {address && tokenData.chain !== networkName && (
                            <div className="transfer-form__error">Please change network to {tokenData.chain}</div>
                        )}
                        {renderButton()}
                    </>
                )}
            </div>
            {trxHash && (
                <div className="transfer-form__hash">
                    <div className="transfer-form__hash__text">
                        <div>Hash:&nbsp;&nbsp;</div>
                        <div id="generated-url">
                            <a href={getTrxHashLink(trxHash, networkName)} target="_blank" rel="noreferrer">
                                {getShortHash(trxHash)}
                            </a>
                        </div>
                    </div>
                    <IconButton aria-label="copy" onClick={handleCopyUrl(trxHash)}>
                        <ContentCopyIcon />
                    </IconButton>
                </div>
            )}
        </div>
    );
});

export default TransferForm;
