import React from "react";

import { useEns } from "../../../../hooks/useEns";
import { getShortAddress } from "../../../../utils/wallet";

import "./styles.scss";

type SendFormRecipientProps = {
    toAddress?: string;
};

const SendFormRecipient = ({ toAddress }: SendFormRecipientProps) => {
    const { isEnsAddress, isEnsName, ensAddress, ensName, isAvvyName, avvyName, isBitName, bitName } =
        useEns(toAddress);

    return (
        <div className="send-form__label">
            Recipient address
            <span className="send-form__label-additional">
                {(isEnsName || isAvvyName || isBitName) && ensAddress && ` (${getShortAddress(ensAddress)})`}
            </span>
            <span className="send-form__label-additional">
                {isEnsAddress && ensName && ` (${ensName})`}
                {isEnsAddress && avvyName && ` (${avvyName})`}
                {isEnsAddress && bitName && ` (${bitName})`}
            </span>
        </div>
    );
};

export default SendFormRecipient;
