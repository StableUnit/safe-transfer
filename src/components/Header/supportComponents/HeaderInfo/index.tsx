import React from "react";
import { GradientHref } from "../../../../ui-kit/components/GradientHref";

import "./styles.scss";

export const HeaderInfo = () => {
    const totalTransferred = 1_250_500;

    return (
        <div className="header-info">
            <div className="header-info__logo">
                <a href="https://stableunit.org/" target="_blank" rel="noreferrer">
                    <img src="https://stableunit.org/assets/img/logo.svg" />
                </a>
            </div>
            <div className="header-info__transferred">
                <GradientHref>Total transferred: </GradientHref>
                <span className="header-info__transferred__total">${totalTransferred.toLocaleString()}+</span>
            </div>
        </div>
    );
};
