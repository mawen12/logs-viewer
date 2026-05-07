import classNames from "classnames"
import ControlsLogsLayout from "./ControlsLogsLayout"
import Header from "../Header/Header"
import { Outlet } from "react-router-dom"

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

        
    </section>
}