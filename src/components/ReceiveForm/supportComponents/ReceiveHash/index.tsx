import React from "react";
import { useNetwork } from "wagmi";
import { IconButton } from "@mui/material";

import { getShortHash, handleCopyUrl } from "../../../../utils/urlGenerator";
import { getTrxHashLink, idToNetwork } from "../../../../utils/network";
import { ReactComponent as ContentCopyIcon } from "../../../../ui-kit/images/copy.svg";

import "./styles.scss";

type ReceiveHashProps = {
    trxHash?: string;
};

const ReceiveHash = ({ trxHash }: ReceiveHashProps) => {
    const { chain } = useNetwork();
    const networkName = chain?.id ? idToNetwork[chain?.id] : undefined;

    return trxHash && networkName ? (
        <div className="receive-form__hash">
            <div className="receive-form__hash__text">
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
    ) : null;
};

export default ReceiveHash;
