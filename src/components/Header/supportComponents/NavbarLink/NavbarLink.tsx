import React from "react";
import cn from "classnames";

import "./NavbarLink.scss";

interface NavbarLinkProps {
    isSelected: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}

const NavbarLink = ({ isSelected, children, onClick }: NavbarLinkProps) => (
    <div onClick={onClick} className={cn("navbar-link", { "navbar-link--selected": isSelected })}>
        {children}
    </div>
);

export default NavbarLink;
