import classNames from "classnames";
import './style.scss';
import { DoneIcon, ErrorIcon, InfoIcon, WarningIcon } from "../icons";

const icons = {
    success: <DoneIcon/>,
    error: <ErrorIcon/>,
    warning: <WarningIcon/>,
    info: <InfoIcon/>
}

const Alert = ({variant, title, children}) => {
    return (
        <div
            className={classNames({
                'lv-alert': true,
                [`lv-alert_${variant}`]: true,
            })}
        >
            <div className='lv-alert__backdrop'/>

            <div className='lv-alert__icon'>{icons[variant || "info"]}</div>

            {title && <div className='lv-alert__title'>{title}</div>}

            {children && <div 
                className={classNames({
                    'lv-alert__content': title,
                    'lv-alert__title': !title,
                })}
            >
                {children}
            </div>}
        </div>
    )
}

export default Alert;