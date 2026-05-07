import { useMemo } from "preact/hooks";
import { matchPath, useLocation } from "react-router-dom";
import { routerOptions } from "../../../router";

const HeaderControls = ({
    controlsComponent,
    ...props
}) => {
    const {pathname} = useLocation();

    const headerSetup = useMemo(() => {
        const matchedEntry = Object.entries(routerOptions).find(([path]) => {
            return matchPath(path, pathname);
        })
    }, [pathname])

    const controls = (
        <ControlsComponent {...props} headerSetup={headerSetup} />
    )

    return controls;
}

export default HeaderControls;