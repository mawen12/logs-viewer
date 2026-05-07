import classNames from "classnames"
import { useNavigationMenu } from "../../../router/navigation"
import NavItem from "./NavItem";
import { useEffect, useState } from "preact/hooks";
import { useLocation } from "react-router-dom";

const HeaderNav = ({color}) => {
    const {pathname} = useLocation();
    const [activeMenu, setActiveMenu] = useState(pathname);
    const menu = useNavigationMenu();

    useEffect(() => {
        setActiveMenu(pathname);
    }, [pathname])

    return (
        <nav
            className={classNames({
                "lv-header-nav": true
            })}
        >
            {menu.map(m => (
                <NavItem
                    key={m.value}
                    activeMenu={activeMenu}
                    value={m.value || ""}
                    label={m.label || ""}
                    color={color}
                />
            ))}
        </nav>
    )
}

export default HeaderNav;