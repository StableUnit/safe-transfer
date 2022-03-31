import React from "react";

import { ReactComponent as CloseIcon } from "../../ui-kit/images/close.svg";

import "./Instructions.scss";

interface InstructionsProps {
    onClose?: () => void;
}

const Instructions = ({ onClose }: InstructionsProps) => (
    <div className="instructions">
        <div onClick={onClose} className="instructions__close">
            <CloseIcon />
        </div>
        <div className="instructions__title">Stop sending tokens to wrong address or blockchain</div>
        <ol className="instructions__steps">
            <li>Approve token instead of sending directly</li>
            <li>Get link to share with recipient</li>
            <li>Recipient accepts money</li>
        </ol>
    </div>
);

export default Instructions;
