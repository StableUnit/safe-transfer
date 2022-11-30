import React from "react";
import cn from "classnames";

import "./InfoCell.scss";

interface InfoCellProps {
    title: string;
    className?: string;
    children: React.ReactNode;
    bubble?: string;
}

export const InfoCell = ({ title, children, className, bubble }: InfoCellProps) => (
    <div className={cn("info-cell", className)}>
        <div className="info-cell__title">
            <div>{title}</div>
            {bubble && <div className="info-cell__bubble">{bubble}</div>}
        </div>
        <div className="info-cell__content">{children}</div>
    </div>
);
