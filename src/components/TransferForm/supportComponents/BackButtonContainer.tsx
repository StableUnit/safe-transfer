import React from "react";
import { BackButton } from "./BackButton";

type BackButtonContainerProps = {
    children: React.ReactNode;
};

export const BackButtonContainer = ({ children }: BackButtonContainerProps) => {
    return (
        <div className="transfer-form">
            {children}
            <BackButton />
        </div>
    );
};
