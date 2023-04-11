import React, { ChangeEvent, useEffect } from "react";
import { TextField } from "@mui/material";
import { useAccount } from "wagmi";

type RecipientInputProps = {
    onAddressChange: (address?: string) => void;
    toAddress?: string;
};

const RecipientInput = ({ onAddressChange, toAddress }: RecipientInputProps) => {
    const { address } = useAccount();

    useEffect(() => {
        onAddressChange(address);
    }, [address]);

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onAddressChange(event.target.value);
    };

    return (
        <>
            <div className="request-form__label">Recipient address</div>
            <TextField
                value={toAddress}
                id="address"
                className="request-form__default-input"
                placeholder="Paste your address here ..."
                variant="outlined"
                onChange={handleAddressChange}
                disabled
            />
        </>
    );
};

export default RecipientInput;
