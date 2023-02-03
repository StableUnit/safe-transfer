import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Footer.scss";
import { SocialNetwork } from "../../ui-kit/components/SocialNetwork/SocialNetwork";

export const Footer = () => {
    const [lastCommitDate, setLastCommitDate] = useState<string>();

    const updateLastCommitDate = async () => {
        const data = await axios.get("https://api.github.com/repos/stableunit/safe-transfer/branches/master");
        const date = data.data?.commit?.commit?.author?.date;
        if (date) {
            setLastCommitDate(new Date(date).toLocaleString());
        }
    };
    useEffect(() => {
        updateLastCommitDate();
    }, []);

    return (
        <div className="footer">
            <div className="footer__social">
                <SocialNetwork name="tg" />
                <SocialNetwork name="discord" />
                <SocialNetwork name="medium" />
                <SocialNetwork name="twitter" />
                <SocialNetwork name="github" />
            </div>
            <div className="footer__made-by">
                Open-source project from{" "}
                <a href="https://stableunit.org/" target="_blank" rel="noreferrer">
                    stableunit.org
                </a>{" "}
                core team.
            </div>
            <div className="footer__version">
                (v{process.env.REACT_APP_VERSION}
                {lastCommitDate ? ` from ${lastCommitDate}` : ""})
            </div>
        </div>
    );
};
