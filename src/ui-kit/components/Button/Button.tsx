import React from "react";
import cn from "classnames";
import "./button.scss";

interface ButtonProps {
    className?: string;
    padding?: string;
    text?: string;
    disabled?: boolean;
    onClick?: () => void;
    width?: number;
    id?: string;
    children?: React.ReactNode;
}

const Button = ({ onClick, padding, text, className, disabled, id, children, width, ...props }: ButtonProps) => {
    return (
        <div
            id={id}
            className={cn("button", className, { "button--disabled": disabled })}
            onClick={disabled ? undefined : onClick}
            style={{ padding, width }}
            {...props}
        >
            <div className="button__content">
                <div className="button__gradient-text">{children ?? text}</div>
            </div>
        </div>
    );
};

export default Button;
