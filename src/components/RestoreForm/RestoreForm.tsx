import React, { ChangeEvent, useContext, useState } from "react";
import Web3 from "web3";
import { IconButton, TextField } from "@mui/material";

import { idToNetwork } from "../../utils/network";
import { generateUrl, getShortUrl, handleCopyUrl } from "../../utils/urlGenerator";
import { addErrorNotification } from "../../utils/notifications";
import Button from "../../ui-kit/components/Button/Button";
import { StateContext } from "../../reducer/constants";

import "./RestoreForm.scss";
import { ReactComponent as ContentCopyIcon } from "../../ui-kit/images/copy.svg";

const RestoreForm = () => {
    const { address, chainId, web3 } = useContext(StateContext);
    const networkName = chainId ? idToNetwork[chainId] : undefined;
    const [restoreHash, setRestoreHash] = useState<undefined | string>(undefined);
    const [isRestoreLoading, setIsRestoreLoading] = useState(false);
    const [genUrl, setGenUrl] = useState<undefined | string>(undefined);

    const handleRestoreHashChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRestoreHash(event.target.value);
    };

    const handleRestore = async () => {
        try {
            setIsRestoreLoading(true);
            const transaction = await web3?.eth.getTransactionReceipt(restoreHash ?? "");
            if (!transaction || !networkName) {
                addErrorNotification("Error", "Can't get transaction");
                setIsRestoreLoading(false);
                return;
            }
            const valueBN = Web3.utils.hexToNumberString(transaction.logs[0].data);
            const to = `0x${transaction.logs[0].topics[2]?.slice(-40)}`;
            setGenUrl(
                generateUrl({
                    address: transaction.to,
                    from: transaction.from,
                    to,
                    value: valueBN,
                    chain: networkName,
                })
            );
            setIsRestoreLoading(false);
        } catch (e) {
            setIsRestoreLoading(false);
            console.error(e);
            addErrorNotification("Error", "Restore transaction failed");
        }
    };

    return (
        <>
            <div className="restore-form__disclaimer">
                Please ask sender to send you a link with receive details. <br />
                Alternatively, you can use widget below to restore details from on-chain data.
            </div>
            <div className="send-form">
                <div className="restore-form__restore">
                    <div>Restore link by Approve transaction hash</div>
                    <TextField
                        id="address"
                        className="restore-form__restore__input"
                        placeholder="Paste transaction hash here ..."
                        variant="outlined"
                        onChange={handleRestoreHashChange}
                    />
                    <Button
                        onClick={handleRestore}
                        className="restore-form__button"
                        disabled={isRestoreLoading || !address || !restoreHash}
                    >
                        {isRestoreLoading ? "Loading..." : "Restore"}
                    </Button>
                </div>
                {genUrl && (
                    <div className="restore-form__url">
                        <div className="restore-form__url__text">
                            <div>Link to receive:&nbsp;&nbsp;</div>
                            <a href={genUrl} target="_blank" rel="noreferrer">
                                {getShortUrl(genUrl)}
                            </a>
                        </div>
                        <IconButton aria-label="copy" onClick={handleCopyUrl(genUrl)}>
                            <ContentCopyIcon />
                        </IconButton>
                    </div>
                )}
            </div>
        </>
    );
};

export default RestoreForm;
