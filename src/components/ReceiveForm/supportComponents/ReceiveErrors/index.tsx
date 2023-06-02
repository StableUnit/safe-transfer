import React from "react";
import { useAccount, useNetwork } from "wagmi";

import { getShortHash } from "../../../../utils/urlGenerator";
import { useReceiveToken } from "../../../../hooks/useReceiveToken";
import { idToNetwork } from "../../../../utils/network";

import "./styles.scss";

type ReceiveErrorsProps = {
    toAddress?: string | null;
};

const ReceiveErrors = ({ toAddress }: ReceiveErrorsProps) => {
    const { address } = useAccount();
    const { tokenData } = useReceiveToken();
    const { chain } = useNetwork();
    const networkName = chain?.id ? idToNetwork[chain?.id] : undefined;

    if (!tokenData) {
        return null;
    }

    return (
        <>
            {address && toAddress && toAddress.toLowerCase() !== address?.toLowerCase() && (
                <div className="receive-form__error">
                    Only account{" "}
                    {tokenData.to.startsWith("0x")
                        ? getShortHash(tokenData.to)
                        : `${tokenData.to}(${getShortHash(toAddress)})`}{" "}
                    can receive the transfer.
                </div>
            )}
            {address && tokenData.chain !== networkName && (
                <div className="receive-form__error">Please change network to {tokenData.chain}</div>
            )}
        </>
    );
};

export default ReceiveErrors;
