import React from "react";

import "./Footer.scss";

export const Footer = () => (
    <div className="footer">
        <div className="footer__made-by">
            Made by{" "}
            <a href="https://stableunit.org/" target="_blank" rel="noreferrer">
                stableunit.org
            </a>{" "}
            core team
        </div>
    </div>
);
