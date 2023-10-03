import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Footer.scss";
import { SocialNetwork } from "../../ui-kit/components/SocialNetwork/SocialNetwork";
import { getVeryShortHash } from "../../utils/urlGenerator";

export const Footer = () => {
    const [lastCommitDate, setLastCommitDate] = useState<string>();
    const [commitData, setCommitData] = useState<Record<string, any>>();

    const updateLastCommitDate = async () => {
        const branch = process.env.REACT_APP_ENV === "production" ? "production" : "master";
        const data = await axios.get(`https://api.github.com/repos/stableunit/safe-transfer/branches/${branch}`);
        const date = data.data?.commit?.commit?.author?.date;
        setCommitData(data.data?.commit);
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
                The “safeTransfer” functionality is under maintenance. Sorry for the inconvenience..
                <br />
                Open-source project from{" "}
                <a href="https://stableunit.org/" target="_blank" rel="noreferrer">
                    stableunit.org
                </a>{" "}
                core team.
            </div>
            <div className="footer__version">
                (
                <a
                    href={`https://github.com/StableUnit/safe-transfer/releases/tag/v${process.env.REACT_APP_VERSION}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    v{process.env.REACT_APP_VERSION}
                </a>
                {lastCommitDate ? ` from ${lastCommitDate}` : ""}
                {commitData?.sha ? (
                    <>
                        ,{" "}
                        <a href={commitData?.html_url} target="_blank" rel="noreferrer">
                            {getVeryShortHash(commitData?.sha)}
                        </a>
                    </>
                ) : (
                    ""
                )}
                )
            </div>
        </div>
    );
};
