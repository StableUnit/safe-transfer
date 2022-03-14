import React from "react";

import "./Instructions.scss";

const Instructions = () => (
    <div className="instructions">
        <div>
            Lots of people accidentally send tokens to the wrong address, wrong blockchains, or contract addresses so
            money get stuck forever.
            <br />
            This tool helps to solve this problem using Erc20 standard with a few simple steps:
            <br />
            1) You make erc20.approve first, instead of sending tokens directly.
            <br />
            2) You send the link to the recipient.
            <br />
            3) Recipient accepts money. If the address was wrong - the money stays in your account.
        </div>
    </div>
);

export default Instructions;
