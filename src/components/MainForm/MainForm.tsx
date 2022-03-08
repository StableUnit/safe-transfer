import React, { useCallback, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { changeNetworkAtMetamask, networkNames, NetworkType } from "../../utils/network";

import "./MainForm.scss";

interface MainFormProps {
    currentNetwork: NetworkType;
}

const MainForm = ({ currentNetwork }: MainFormProps) => {
    const handleNetworkChange = useCallback((event) => {
        changeNetworkAtMetamask(event.target.value);
    }, []);

    if (!currentNetwork) {
        return <div className="main-form">Please connect your wallet</div>;
    }

    return (
        <div className="main-form">
            <FormControl className="main-form__network-form">
                <InputLabel id="demo-simple-select-label">Network</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={currentNetwork}
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
        </div>
    );
};

export default MainForm;
