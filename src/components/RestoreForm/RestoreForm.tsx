import React, { ChangeEvent, useState } from "react";
import { TextField } from "@mui/material";
import Web3 from "web3";

import { useAccount, useNetwork } from "wagmi";
import { idToNetwork } from "../../utils/network";
import { addErrorNotification } from "../../utils/notifications";
import Button from "../../ui-kit/components/Button/Button";
import GenUrl from "../GenUrl";
import { generateUrl } from "../../utils/urlGenerator";

import "./RestoreForm.scss";

interface RestoreFormProps {
    onConnect: () => void;
}

const RestoreForm = ({ onConnect }: RestoreFormProps) => {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { connector } = useAccount();
    const networkName = chain?.id ? idToNetwork[chain?.id] : undefined;
    const [restoreHash, setRestoreHash] = useState<undefined | string>(undefined);
    const [isRestoreLoading, setIsRestoreLoading] = useState(false);
    const [genUrl, setGenUrl] = useState<undefined | string>(undefined);

    const handleRestoreHashChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRestoreHash(event.target.value);
    };

    const handleRestore = async () => {
        try {
            const web3 = new Web3(await connector?.getProvider());
            const transaction = await web3?.eth.getTransactionReceipt(restoreHash ?? "");
            if (!transaction || !networkName) {
                addErrorNotification("Error", "Can't get transaction");
                return;
            }
            setIsRestoreLoading(true);
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
            <div className="send-form restore-form">
                <div className="restore-form__restore">
                    <div>Restore link by Approve transaction hash</div>
                    <TextField
                        id="address"
                        className="restore-form__restore__input"
                        placeholder="Paste transaction hash here ..."
                        variant="outlined"
                        onChange={handleRestoreHashChange}
                    />
                    {address ? (
                        <Button
                            onClick={handleRestore}
                            className="restore-form__button"
                            disabled={isRestoreLoading || !restoreHash}
                        >
                            {isRestoreLoading ? "Loading..." : "Restore"}
                        </Button>
                    ) : (
                        <Button onClick={onConnect} className="restore-form__button">
                            CONNECT WALLET
                        </Button>
                    )}
                </div>
                <GenUrl genUrl={genUrl} text="Link to receive:" />
            </div>
        </>
    );
};

export default RestoreForm;
