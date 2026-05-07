import { NavLink, useNavigate } from "react-router-dom";
import router from "../../router";
import classNames from "classnames";
import { useMemo } from "preact/hooks";
import HeaderNav from "./HeaderNav/HeaderNav";
import HeaderControls from "./HeaderControls/HeaderControls";

const Logo = () => <NavLink to={router.home}>Logs Viewer</NavLink> 

const Header = ({controlsComponent}) => {
    const navigate = useNavigate();

    const { background, color } = useMemo(() => {
        return {background: "#FFF", color: "#FFF"};
    }, []);

    const onClickLogo = (e) => {
        e.preventDefault();
        navigate({pathname: router.home});
        window.location.reload();
    }

    return <header
        className={classNames({
            "lv-header": true,
        })}
        style={{background, color}}
    >
        <div
            className="lv-header-logo"
            onClick={onClickLogo}
            style={{ color }}
        >
            {<Logo/>}
        </div>

        <HeaderNav color={color}/>

        <HeaderControls controlsComponent={controlsComponent} />
    </header>
}

export default Header;