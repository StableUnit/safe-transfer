import React, { ChangeEvent, useContext, useState } from "react";
import { TextField } from "@mui/material";
import Web3 from "web3";

import { InfoCell } from "../../../InfoCell/InfoCell";
import {
    beautifyTokenBalance,
    CUSTOM_TOKENS,
    getCustomTokenMetadata,
    TokenMetadataType,
} from "../../../../utils/tokens";
import { addErrorNotification, addSuccessNotification } from "../../../../utils/notifications";

import "./CustomTokenModalContent.scss";
import { NetworkType } from "../../../../utils/network";
import Button from "../../../../ui-kit/components/Button/Button";
import { addToken, getTokens } from "../../../../utils/storage";
import { DispatchContext, StateContext } from "../../../../reducer/constants";
import { Actions } from "../../../../reducer";

interface CustomTokenModalContentProps {
    networkName: NetworkType;
    onClose: () => void;
}

const CustomTokenModalContent = React.forwardRef<HTMLDivElement, CustomTokenModalContentProps>(
    ({ networkName, onClose }, ref) => {
        const { address } = useContext(StateContext);
        const dispatch = useContext(DispatchContext);
        const [tokenAddress, setTokenAddress] = useState<undefined | string>(undefined);
        const [tokenMetadata, setTokenMetadata] = useState<TokenMetadataType | undefined>(undefined);

        const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setTokenAddress(event.target.value);
        };

        const handleBlur = async () => {
            if (!tokenAddress || !address) {
                return;
            }

            setTokenMetadata(undefined);
            if (Web3.utils.isAddress(tokenAddress)) {
                setTokenMetadata(await getCustomTokenMetadata(networkName, tokenAddress, address));
            } else {
                addErrorNotification("Error", "Address is not correct");
            }
        };

        const handleAddToken = () => {
            if (tokenMetadata) {
                addToken(tokenMetadata);
                dispatch({ type: Actions.AddToken, payload: tokenMetadata });
                addSuccessNotification("Success", "Token added");
                onClose();
            }
        };

        const hasTokenAdded = !!(
            tokenAddress &&
            (getTokens().find((customToken) => customToken.address === tokenAddress) ||
                CUSTOM_TOKENS[networkName].find((customToken) => customToken.address === tokenAddress))
        );

        return (
            <div className="custom-token-modal" ref={ref}>
                <div className="custom-token-modal__title">Custom Token</div>

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

                <Button onClick={handleAddToken} disabled={!tokenMetadata || hasTokenAdded}>
                    Add token
                </Button>
            </div>
        );
    }
);

export default CustomTokenModalContent;
