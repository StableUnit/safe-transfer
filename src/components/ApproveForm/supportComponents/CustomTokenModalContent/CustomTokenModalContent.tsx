import React, { ChangeEvent, useContext, useState } from "react";
import { TextField } from "@mui/material";
import Web3 from "web3";
import { useMoralis } from "react-moralis";

import { InfoCell } from "../../../InfoCell/InfoCell";
import {
    beautifyTokenBalance,
    CUSTOM_TOKENS,
    getCustomTokenMetadata,
    TokenMetadataType,
} from "../../../../utils/tokens";
import { addErrorNotification, addSuccessNotification } from "../../../../utils/notifications";

import "./CustomTokenModalContent.scss";
import { CustomNetworkType } from "../../../../utils/network";
import Button from "../../../../ui-kit/components/Button/Button";
import { addToken, getTokens } from "../../../../utils/storage";
import { DispatchContext } from "../../../../reducer/constants";
import { Actions } from "../../../../reducer";

interface CustomTokenModalContentProps {
    networkName: CustomNetworkType;
    onClose: () => void;
}

const CustomTokenModalContent = React.forwardRef<HTMLDivElement, CustomTokenModalContentProps>(
    ({ networkName, onClose }, ref) => {
        const { account } = useMoralis();
        const dispatch = useContext(DispatchContext);
        const [address, setAddress] = useState<undefined | string>(undefined);
        const [tokenMetadata, setTokenMetadata] = useState<TokenMetadataType | undefined>(undefined);

        const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setAddress(event.target.value);
        };

        const handleBlur = async () => {
            if (!address || !account) {
                return;
            }

            setTokenMetadata(undefined);
            if (Web3.utils.isAddress(address)) {
                setTokenMetadata(await getCustomTokenMetadata(networkName, address, account));
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
            address &&
            (getTokens().find((customToken) => customToken.address === address) ||
                CUSTOM_TOKENS[networkName].find((customToken) => customToken.address === address))
        );

        return (
            <div className="custom-token-modal" ref={ref}>
                <div className="custom-token-modal__title">Custom Token</div>

                <div className="custom-token-modal__label">New token address</div>
                <TextField
                    id="custom-token-address"
                    className="custom-token-modal__address"
                    placeholder="Paste address here ..."
                    value={address}
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
