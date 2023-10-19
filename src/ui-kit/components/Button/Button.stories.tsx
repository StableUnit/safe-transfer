import React from "react";
import { ComponentMeta } from "@storybook/react";

import Button from "./Button";

export default {
    title: "Example/Button",
    component: Button,
} as ComponentMeta<typeof Button>;

export const Enabled = () => (
    <div style={{ width: "400px" }}>
        <Button text="SWAP" />
    </div>
);

export const Disabled = () => (
    <div style={{ width: "400px" }}>
        <Button disabled>SWAP</Button>
    </div>
);
