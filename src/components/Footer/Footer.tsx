import React from "react";

import "./Footer.scss";
import { SocialNetwork } from "../../ui-kit/components/SocialNetwork/SocialNetwork";

export const Footer = () => (
    <div className="footer">
        <div className="footer__social">
            <SocialNetwork name="tg" />
            <SocialNetwork name="discord" />
            <SocialNetwork name="medium" />
            <SocialNetwork name="twitter" />
            <SocialNetwork name="github" />
        </div>
        <div className="footer__made-by">
            Made by{" "}
            <a href="https://stableunit.org/" target="_blank" rel="noreferrer">
                stableunit.org
            </a>{" "}
            core team
        </div>
        <div className="footer__version">(v{process.env.REACT_APP_VERSION})</div>
    </div>
);
