import React, { useEffect, useState } from "react";
import { Button, List, ListItem, ListItemText } from "@mui/material";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Web3 from "web3";
import BN from "bignumber.js";

import Moralis from "moralis";
import { idToNetwork } from "../../utils/network";
import { decodeToken } from "../../utils/urlGenerator";
import { toHRNumberFloat } from "../../utils/tokens";

import "./TransferForm.scss";
import { APPROVE_ABI, TRANSFER_FROM_ABI } from "../../contracts/abi";
import { addErrorNotification } from "../../utils/notifications";

interface TransferFormProps {
    token: string;
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

const TransferForm = React.memo(({ token }: TransferFormProps) => {
    const { account, chainId: hexChainId } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const [tokenMetadata, setTokenMetadata] = useState<undefined | TokenMetadataType>(undefined);
    const [isTransferFetching, setIsTransferFetching] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const chainId = Web3.utils.hexToNumber(hexChainId ?? "");
    const networkName = idToNetwork[chainId];
    const tokenData = decodeToken(token);

    useEffect(() => {
        if (tokenData) {
            const options = { chain: hexChainId, addresses: [tokenData.address] };
            // @ts-ignore
            Web3Api.token.getTokenMetadata(options).then((res) => {
                setTokenMetadata(res?.[0]);
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
                await Moralis.executeFunction(options);
                setIsSuccess(true);
                setIsTransferFetching(false);
            }
        } catch (e) {
            console.error(e);
            // @ts-ignore
            addErrorNotification("TransferFrom Error", e?.error?.message);
            setIsTransferFetching(false);
        }
    };

    if (isSuccess) {
        return <div className="transfer-form">Thanks for using our safe-transfer app!</div>;
    }

    if (!tokenData) {
        return <div className="transfer-form">Invalid token</div>;
    }

    if (!account) {
        return <div className="transfer-form">Please connect your wallet</div>;
    }

    if (tokenData.to.toLowerCase() !== account.toLowerCase()) {
        return <div className="transfer-form">Please change account to {tokenData.to}</div>;
    }

    if (tokenData.chain !== networkName) {
        return <div className="transfer-form">Please change network to {tokenData.chain}</div>;
    }

    const hasAllData =
        tokenData.chain &&
        tokenData.from &&
        tokenData.to &&
        tokenData.address &&
        tokenData.value?.length > 0 &&
        tokenData.value !== "0";

    return (
        <div className="transfer-form">
            <div className="transfer-form__title">You are able to receive:</div>
            {tokenMetadata && tokenData && (
                <>
                    <List className="transfer-form__info" component="nav" aria-label="mailbox folders">
                        <ListItem button divider>
                            <ListItemText primary={`Network: ${networkName}`} />
                        </ListItem>
                        <ListItem button divider>
                            <ListItemText primary={`From: ${tokenData.from}`} />
                        </ListItem>
                        <ListItem button divider>
                            <ListItemText primary={`To: ${tokenData.to}`} />
                        </ListItem>
                        <ListItem button divider>
                            <ListItemText primary={`Token address: ${tokenData.address}`} />
                        </ListItem>
                        <ListItem button>
                            <ListItemText
                                primary={`Value: ${toHRNumberFloat(new BN(tokenData.value), +tokenMetadata.decimals)} ${
                                    tokenMetadata.symbol
                                }`}
                            />
                        </ListItem>
                    </List>
                    <Button
                        variant="contained"
                        onClick={handleTransfer}
                        className="transfer-form__button"
                        disabled={!hasAllData || isTransferFetching}
                    >
                        Receive
                    </Button>
                </>
            )}
        </div>
    );
});

export default TransferForm;
