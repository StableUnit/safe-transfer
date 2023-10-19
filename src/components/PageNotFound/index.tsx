import React from "react";
import { GradientHref } from "../../ui-kit/components/GradientHref";

import "./styles.scss";

export const PageNotFound = () => (
    <div className="page-not-found">
        <div>Broken link, please be sure you use correct link. Or ask for support at </div>
        <GradientHref href="https://t.me/stableunit" isExternal target="_blank">
            https://t.me/stableunit
        </GradientHref>
    </div>
);
