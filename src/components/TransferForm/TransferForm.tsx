import React, { useEffect, useState } from "react";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Web3 from "web3";
import BN from "bn.js";
import Moralis from "moralis";

import cn from "classnames";
import { getAddressLink, getTrxHashLink, idToNetwork, networkNames, networkToId } from "../../utils/network";
import { decodeToken, getShortHash, handleCopyUrl, TokenInfoType } from "../../utils/urlGenerator";
import { toHRNumberFloat } from "../../utils/tokens";
import { TRANSFER_FROM_ABI } from "../../contracts/abi";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";
import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";
import { ReactComponent as MetamaskIcon } from "../../ui-kit/images/metamask.svg";
import Button from "../../ui-kit/components/Button/Button";

import "./TransferForm.scss";
import { InfoCell } from "./supportComponents/InfoCell";
import { NetworkImage } from "../../ui-kit/components/NetworkImage/NetworkImage";

interface TransferFormProps {
    token: string;
    onMetamaskConnect?: () => void;
    onWalletConnect?: () => void;
}

type TokenMetadataType = {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    logo?: string | undefined;
    // eslint-disable-next-line camelcase
    logo_hash?: string | undefined;
    thumbnail?: string | undefined;
    // eslint-disable-next-line camelcase
    block_number?: string | undefined;
    validated?: string | undefined;
};

const getValue = (tokenMetadata: TokenMetadataType | undefined, tokenData: TokenInfoType) =>
    tokenMetadata
        ? `${toHRNumberFloat(new BN(tokenData.value), +tokenMetadata.decimals)} ${tokenMetadata.symbol}`
        : tokenData.value;

const TransferForm = React.memo(({ token, onMetamaskConnect, onWalletConnect }: TransferFormProps) => {
    const { account, chainId: hexChainId } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const [tokenMetadata, setTokenMetadata] = useState<undefined | TokenMetadataType>(undefined);
    const [isTransferFetching, setIsTransferFetching] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [trxHash, setTrxHash] = useState("");
    const chainId = Web3.utils.hexToNumber(hexChainId ?? "");
    const networkName = idToNetwork[chainId];
    const tokenData = decodeToken(token);

    useEffect(() => {
        if (tokenData) {
            const options = {
                chain: Web3.utils.numberToHex(networkToId[tokenData.chain]),
                addresses: [tokenData.address],
            };
            // @ts-ignore
            Web3Api.token.getTokenMetadata(options).then((res) => {
                setTokenMetadata(res?.[0]);
                document.title = `Receive ${getValue(res?.[0], tokenData)}`;
            });
        }
    }, [token, account]);

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
        !account || tokenData.to.toLowerCase() !== account.toLowerCase() || tokenData.chain !== networkName;

    const renderButton = () => {
        if (isSuccess) {
            return null;
        }
        if (!account) {
            return (
                <>
                    <Button onClick={onWalletConnect} className="transfer-form__button__wc">
                        CONNECT WALLET
                    </Button>
                    <Button onClick={onMetamaskConnect} className="transfer-form__button__metamask">
                        CONNECT WALLET
                    </Button>
                </>
            );
        }

        return (
            <Button
                onClick={handleTransfer}
                className="transfer-form__button"
                disabled={!hasAllData || isTransferFetching || isDisabledContent}
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
                                <div>{getShortHash(tokenData.from)}</div>
                                <div onClick={handleCopyUrl(tokenData.from)}>
                                    <ContentCopyIcon />
                                </div>
                            </InfoCell>
                            <InfoCell className="transfer-form__copy-container" title="To:">
                                <div>{getShortHash(tokenData.to)}</div>
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
                                <div>{getShortHash(tokenData.address)}</div>
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
                        <InfoCell title="Value:">{getValue(tokenMetadata, tokenData)}</InfoCell>
                        {account && tokenData.to.toLowerCase() !== account?.toLowerCase() && (
                            <div className="transfer-form__error">
                                Please change account to {getShortHash(tokenData.to)}
                            </div>
                        )}
                        {account && tokenData.chain !== networkName && (
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
