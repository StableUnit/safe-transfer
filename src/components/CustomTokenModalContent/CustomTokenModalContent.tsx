import React, { ChangeEvent, useContext, useState } from "react";
import { TextField } from "@mui/material";
import Web3 from "web3";

import { useAccount, useNetwork } from "wagmi";
import { InfoCell } from "../InfoCell/InfoCell";
import { beautifyTokenBalance, CUSTOM_TOKENS, getCustomTokenMetadata, TokenMetadataType } from "../../utils/tokens";
import { addErrorNotification, addSuccessNotification } from "../../utils/notifications";
import { idToNetwork, networkNames } from "../../utils/network";
import Button from "../../ui-kit/components/Button/Button";
import { addToken, getTokens } from "../../utils/storage";
import { DispatchContext, StateContext } from "../../reducer/constants";
import { Actions } from "../../reducer";

import "./CustomTokenModalContent.scss";

interface CustomTokenModalContentProps {
    onClose: () => void;
}

const CustomTokenModalContent = React.forwardRef<HTMLDivElement, CustomTokenModalContentProps>(({ onClose }, ref) => {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const dispatch = useContext(DispatchContext);
    const { uiSelectedChainId } = useContext(StateContext);
    const [tokenAddress, setTokenAddress] = useState<undefined | string>(undefined);
    const [tokenMetadata, setTokenMetadata] = useState<TokenMetadataType | undefined>(undefined);
    const networkName = chain?.id ? idToNetwork[chain?.id] : idToNetwork[uiSelectedChainId];

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTokenAddress(event.target.value);
    };

    const handleBlur = async () => {
        if (!tokenAddress || !address) {
            return;
        }

        if (Web3.utils.isAddress(tokenAddress)) {
            if (tokenMetadata?.address !== tokenAddress) {
                setTokenMetadata(undefined);
                setTokenMetadata(await getCustomTokenMetadata(networkName, tokenAddress, address));
            }
        } else {
            addErrorNotification("Error", "Address is not correct");
        }
    };

    const handleAddToken = () => {
        if (tokenMetadata && chain?.id) {
            addToken(tokenMetadata, chain.id);
            dispatch({ type: Actions.AddToken, payload: { ...tokenMetadata, chainId: chain.id } });
            addSuccessNotification("Success", "Token added");
            onClose();
        }
    };

    const hasTokenAdded = Boolean(
        tokenAddress &&
            (getTokens().find((customToken) => customToken.address === tokenAddress) ||
                CUSTOM_TOKENS[networkName].find((customToken) => customToken.address === tokenAddress))
    );

    return (
        <div className="custom-token-modal" ref={ref}>
            <div className="custom-token-modal__title">Add Custom Token for {networkNames[networkName]}</div>

            <div className="custom-token-modal__label">New token address</div>
            <TextField
                id="custom-token-address"
                className="custom-token-modal__address"
                placeholder="Paste address here ..."
                value={tokenAddress}
                variant="outlined"
                onChange={handleAddressChange}
                onBlur={handleBlur}
            />

            <div className="custom-token-modal__info">
                <InfoCell title="Name:">
                    <div>{tokenMetadata?.name ?? "-"}</div>
                </InfoCell>
                <InfoCell title="Symbol:">
                    <div>{tokenMetadata?.symbol ?? "-"}</div>
                </InfoCell>
                <InfoCell title="Decimals:">
                    <div>{tokenMetadata?.decimals ?? "-"}</div>
                </InfoCell>
                <InfoCell title="Balance:">
                    <div>
                        {tokenMetadata?.balance
                            ? beautifyTokenBalance(tokenMetadata.balance, +tokenMetadata.decimals)
                            : "-"}
                    </div>
                </InfoCell>
            </div>

            {hasTokenAdded && <div className="custom-token-modal__error">This address has already been added</div>}

            <Button onClick={handleAddToken} disabled={!tokenMetadata || hasTokenAdded || !chain?.id}>
                Add token
            </Button>
        </div>
    );
});

export default CustomTokenModalContent;
