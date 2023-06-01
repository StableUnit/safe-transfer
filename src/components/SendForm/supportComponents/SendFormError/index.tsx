import React from "react";

import { useEns } from "../../../../hooks/useEns";
import { useRequestToken } from "../../../../hooks/useRequestToken";

import "./styles.scss";

type SendFormErrorProps = {
    toAddress?: string;
    networkName: string;
};

const SendFormError = ({ toAddress, networkName }: SendFormErrorProps) => {
    const {
        isEnsAddress,
        isEnsName,
        ensAddress,
        isEnsNameLoading,
        isAvvyNameLoading,
        isBitNameLoading,
        isBitName,
        isAvvyName,
    } = useEns(toAddress);
    const { requestTokenData } = useRequestToken();

    return (
        <>
            {requestTokenData && requestTokenData.networkName !== networkName && (
                <div className="send-form-error">Please change network to {requestTokenData.networkName}</div>
            )}
            {toAddress && !isEnsAddress && !isEnsName && !isAvvyName && !isBitName && (
                <div className="send-form-error">Please write correct recipient address</div>
            )}
            {isEnsNameLoading && <div className="send-form-warning">ENS resolve in progress</div>}
            {isAvvyNameLoading && <div className="send-form-warning">AVAX resolve in progress</div>}
            {isBitNameLoading && <div className="send-form-warning">.bit resolve in progress</div>}
            {isEnsName && !ensAddress && !isEnsNameLoading && (
                <div className="send-form-error">Can't resolve ENS address</div>
            )}
            {isAvvyName && !ensAddress && !isAvvyNameLoading && (
                <div className="send-form-error">Can't resolve AVAX address</div>
            )}
            {isBitName && !ensAddress && !isBitNameLoading && (
                <div className="send-form-error">Can't resolve .bit address</div>
            )}
        </>
    );
};

export default SendFormError;
