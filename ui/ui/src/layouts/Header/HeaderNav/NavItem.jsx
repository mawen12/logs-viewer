import classNames from "classnames"
import { NavLink } from "react-router-dom"

const NavItem = ({
    activeMenu,
    label,
    value,
    color
}) => {

    return <>
        <NavLink
            className={classNames({
                "lv-header-nav-item": true,
                "lv-header-nav-item_active": activeMenu === value,
            })}
            style={{ color }}
            to={value}
        >
            {{label}}
        </NavLink>
    </>
}

export default NavItem