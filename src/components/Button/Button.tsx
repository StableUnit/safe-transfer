import React from "react";
import cn from "classnames";

import "./Button.scss";

interface ButtonProps {
    className?: string;
    padding?: string;
    text?: string;
    disabled?: boolean;
    onClick?: () => void;
}
const Button = ({ onClick, padding, text, className, disabled }: ButtonProps) => {
    return (
        <div
            className={cn("button", className, { "button--disabled": disabled })}
            onClick={onClick}
            style={{ padding }}
        >
            {text}
        </div>
    );
};

export default Button;
