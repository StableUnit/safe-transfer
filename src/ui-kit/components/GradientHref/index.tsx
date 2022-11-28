import React from "react";
import cn from "classnames";
import { NavLink } from "react-router-dom";

import "./styles.scss";

interface GradientBorderProps {
    id?: string;
    className?: string;
    target?: string;
    disabled?: boolean;
    href?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export const GradientHref = ({ id, children, className, target, disabled, href, onClick }: GradientBorderProps) => {
    return href ? (
        <NavLink
            id={id}
            onClick={onClick}
            to={href}
            target={target}
            rel="noreferrer"
            className={cn("gradient-href", className, { "gradient-href--disabled": disabled })}
        >
            {/* @ts-ignore */}
            {children}
        </NavLink>
    ) : (
        <div
            onClick={onClick}
            id={id}
            className={cn("gradient-href gradient-href-text", className, { "gradient-href--disabled": disabled })}
        >
            {children}
        </div>
    );
};
