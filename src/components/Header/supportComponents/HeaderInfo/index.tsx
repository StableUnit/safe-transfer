import React from "react";
import { GradientHref } from "../../../../ui-kit/components/GradientHref";
import { useVolume } from "../../../../hooks/useVolume";

import "./styles.scss";

export const HeaderInfo = () => {
    const volume = useVolume();

    return (
        <div className="header-info">
            <div className="header-info__logo">
                <a href="https://stableunit.org/" target="_blank" rel="noreferrer">
                    <img src="https://stableunit.org/assets/img/logo.svg" />
                </a>
            </div>
            {volume !== 0 && (
                <div className="header-info__transferred">
                    <GradientHref>Total transferred: </GradientHref>
                    <span className="header-info__transferred__total">${Math.floor(volume).toLocaleString()}+</span>
                </div>
            )}
        </div>
    );
};
