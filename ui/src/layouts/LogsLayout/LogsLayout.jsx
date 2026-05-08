import classNames from "classnames"
import ControlsLogsLayout from "./ControlsLogsLayout"
import Header from "../Header/Header"
import { Outlet } from "react-router-dom"
import Footer from "../Footer/Footer"
import { footerLinksToLogs } from "../../constant/footerLinks"

const LogsLayout = () => {
    
    return <section 
        className={classNames({
            "lv-container": true,
        })}
    >
        <Header controlsComponent={ControlsLogsLayout}/>

        <div 
            id="lv-body"
            className={classNames({
                "lv-container-body": true,
            })}
        >
            <Outlet/>
        </div>

        <Footer links={footerLinksToLogs}/>
    </section>
}

export default LogsLayout;