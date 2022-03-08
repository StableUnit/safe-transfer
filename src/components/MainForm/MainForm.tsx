import React, { ChangeEvent, useCallback, useState } from "react";
import Web3 from "web3";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useMoralis } from "react-moralis";
import { changeNetworkAtMetamask, idToNetwork, networkNames } from "../../utils/network";

import "./MainForm.scss";
import { isAddress } from "../../utils/wallet";

interface MainFormProps {}

const MainForm = () => {
    const { account, chainId: hexChainId } = useMoralis();
    const chainId = Web3.utils.hexToNumber(hexChainId ?? "");
    const [toAddress, setToAddress] = useState<undefined | string>(undefined);
    const [value, setValue] = useState<undefined | number>(undefined);

    const handleNetworkChange = useCallback((event) => {
        changeNetworkAtMetamask(event.target.value);
    }, []);

    if (!account) {
        return <div className="main-form">Please connect your wallet</div>;
    }

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToAddress(event.target.value);
    };

    const handleValueChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(+event.target.value);
    };

    const handleApprove = () => {
        console.log(toAddress, value);
    };

    const isCorrectData = isAddress(toAddress) && (value ?? 0) > 0;

    return (
        <div className="main-form">
            <FormControl className="main-form__network-form">
                <InputLabel id="demo-simple-select-label">Network</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={idToNetwork[chainId]}
                    label="Age"
                    onChange={handleNetworkChange}
                >
                    {Object.entries(networkNames).map(([networkId, networkName]) => (
                        <MenuItem key={networkId} value={networkId}>
                            {networkName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                id="address"
                className="main-form__address"
                label="Address"
                variant="outlined"
                onChange={handleAddressChange}
            />
            <TextField
                id="value"
                className="main-form__value"
                label="Value"
                type="number"
                onChange={handleValueChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button variant="contained" onClick={handleApprove} className="main-form__button" disabled={!isCorrectData}>
                Approve
            </Button>
        </div>
    );
};

export default MainForm;
