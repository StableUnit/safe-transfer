import React, { ChangeEvent, useState } from "react";
import { TextField } from "@mui/material";
import Web3 from "web3";
import { useMoralis } from "react-moralis";

import { InfoCell } from "../../../InfoCell/InfoCell";
import { beautifyTokenBalance, getCustomTokenMetadata, TokenMetadataType } from "../../../../utils/tokens";
import { addErrorNotification } from "../../../../utils/notifications";

import "./CustomTokenModalContent.scss";
import { CustomNetworkType } from "../../../../utils/network";
import Button from "../../../../ui-kit/components/Button/Button";

interface CustomTokenModalContentProps {
    networkName: CustomNetworkType;
    onClose: () => void;
}

const CustomTokenModalContent = React.forwardRef<HTMLDivElement, CustomTokenModalContentProps>(
    ({ networkName, onClose }, ref) => {
        const { account } = useMoralis();
        const [address, setAddress] = useState<undefined | string>(undefined);
        const [tokenMetadata, setTokenMetadata] = useState<TokenMetadataType | undefined>(undefined);

        const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setAddress(event.target.value);
        };

        const handleBlur = async () => {
            if (!address || !account) {
                return;
            }

            if (Web3.utils.isAddress(address)) {
                setTokenMetadata(await getCustomTokenMetadata(networkName, address, account));
            } else {
                addErrorNotification("Address is not correct");
            }
        };

        const handleAddToken = () => {
            console.log("handleAddToken");
            onClose();
        };

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

                <Button onClick={handleAddToken} disabled={!tokenMetadata}>
                    Add token
                </Button>
            </div>
        );
    }
);

export default CustomTokenModalContent;
