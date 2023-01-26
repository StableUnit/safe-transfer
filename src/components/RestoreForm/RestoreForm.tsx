import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { TextField } from "@mui/material";

import { useTransaction } from "wagmi";
import { idToNetwork } from "../../utils/network";
import { addErrorNotification } from "../../utils/notifications";
import Button from "../../ui-kit/components/Button/Button";
import { StateContext } from "../../reducer/constants";

import "./RestoreForm.scss";
import GenUrl from "../GenUrl";

const RestoreForm = () => {
    const { address, chainId } = useContext(StateContext);
    const networkName = chainId ? idToNetwork[chainId] : undefined;
    const [restoreHash, setRestoreHash] = useState<undefined | string>(undefined);
    const [isRestoreLoading, setIsRestoreLoading] = useState(false);
    const [genUrl, setGenUrl] = useState<undefined | string>(undefined);

    // @ts-ignore
    const { data: transactionData } = useTransaction({ hash: restoreHash });

    const handleRestoreHashChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRestoreHash(event.target.value);
    };

    useEffect(() => {
        if (transactionData) {
            console.log(transactionData);
            // const valueBN = Web3.utils.hexToNumberString(transactionData..logs[0].data);
            // const to = `0x${transaction.logs[0].topics[2]?.slice(-40)}`;
            // setGenUrl(
            //   generateUrl({
            //       address: transactionData.to,
            //       from: transactionData.from,
            //       to,
            //       value: valueBN,
            //       chain: networkName,
            //   })
            // );
        }
    }, [transactionData]);

    const handleRestore = async () => {
        try {
            setIsRestoreLoading(true);
            // if (!transaction || !networkName) {
            //     addErrorNotification("Error", "Can't get transaction");
            //     setIsRestoreLoading(false);
            //     return;
            // }
            // const valueBN = Web3.utils.hexToNumberString(transaction.logs[0].data);
            // const to = `0x${transaction.logs[0].topics[2]?.slice(-40)}`;
            // setGenUrl(
            //     generateUrl({
            //         address: transaction.to,
            //         from: transaction.from,
            //         to,
            //         value: valueBN,
            //         chain: networkName,
            //     })
            // );
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
                <GenUrl genUrl={genUrl} text="Link to receive:" />
            </div>
        </>
    );
};

export default RestoreForm;
