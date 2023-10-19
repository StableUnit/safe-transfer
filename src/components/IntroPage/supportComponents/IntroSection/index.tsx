import React from "react";
import cn from "classnames";

import "./styles.scss";

type IntroSectionProps = {
    left?: number;
    right?: number;
    children: React.ReactNode;
    className?: string;
};

const IntroSection = ({ left, right, children, className }: IntroSectionProps) => (
    <div className={cn("intro-section", className)} style={{ left, right }}>
        {children}
    </div>
);

export default IntroSection;
