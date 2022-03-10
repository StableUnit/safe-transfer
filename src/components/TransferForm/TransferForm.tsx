import React, { useEffect, useState } from "react";
import { Button, List, ListItem, ListItemText } from "@mui/material";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Web3 from "web3";
import BN from "bignumber.js";

import { idToNetwork } from "../../utils/network";
import { decodeToken } from "../../utils/urlGenerator";
import { toHRNumberFloat } from "../../utils/tokens";

import "./TransferForm.scss";

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

const TransferForm = ({ token }: TransferFormProps) => {
    const { account, chainId: hexChainId } = useMoralis();
    const Web3Api = useMoralisWeb3Api();
    const [tokenMetadata, setTokenMetadata] = useState<undefined | TokenMetadataType>(undefined);
    const chainId = Web3.utils.hexToNumber(hexChainId ?? "");
    const networkName = idToNetwork[chainId];
    const tokenData = decodeToken(token);

    useEffect(() => {
        const options = { chain: hexChainId, addresses: [tokenData.address] };
        // @ts-ignore
        Web3Api.token.getTokenMetadata(options).then((res) => {
            setTokenMetadata(res?.[0]);
        });
    }, []);

    const handleTransfer = () => {
        console.log(1);
    };

    if (!account) {
        return <div className="transfer-form">Please connect your wallet</div>;
    }

    if (tokenData.to.toLowerCase() !== account.toLowerCase()) {
        return <div className="transfer-form">Please change account to {tokenData.to}</div>;
    }

    if (tokenData.chain !== networkName) {
        return <div className="transfer-form">Please change network to {tokenData.chain}</div>;
    }

    return (
        <div className="transfer-form">
            <div className="transfer-form__title">You are able to receive:</div>
            {tokenMetadata && (
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
                    <Button variant="contained" onClick={handleTransfer} className="transfer-form__button">
                        Receive
                    </Button>
                </>
            )}
        </div>
    );
};

export default TransferForm;
