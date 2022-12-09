import React from "react";
import cn from "classnames";

import "./styles.scss";

interface LoaderLineProps {
    width?: number;
    height?: number;
    className?: string;
}

export const LoaderLine = ({ width = 80, height = 12, className }: LoaderLineProps) => (
    <div className={cn("loader-line", className)} style={{ width, height }} />
);
