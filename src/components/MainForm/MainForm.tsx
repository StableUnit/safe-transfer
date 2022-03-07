import React, { useCallback, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import "./MainForm.scss";

interface MainFormProps {}

const networks = {
    eth: "Ethereum",
    polygon: "Polygon",
    arbitrum: "Arbitrum",
    optimism: "Optimism",
};

const MainForm = ({}: MainFormProps) => {
    const [currentNetwork, setCurrentNetwork] = useState("eth");
    const handleNetworkChange = useCallback(
        (event) => {
            setCurrentNetwork(event.target.value);
        },
        [setCurrentNetwork]
    );

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
                    {Object.entries(networks).map(([networkId, networkName]) => (
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
