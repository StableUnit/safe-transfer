import React from "react";
import cn from "classnames";

import "./InfoCell.scss";

interface InfoCellProps {
    title: string;
    className?: string;
    children: React.ReactNode;
}

export const InfoCell = ({ title, children, className }: InfoCellProps) => (
    <div className={cn("info-cell", className)}>
        <div className="info-cell__title">{title}</div>
        <div className="info-cell__content">{children}</div>
    </div>
);
