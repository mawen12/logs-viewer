import classNames from 'classnames';
import './style.scss'

const Button = ({variant = "contained", color = "color", size = "medium", ariaLabel, children, endIcon, startIcon, fullWidth = false, className, disabled, onClick, onMouseDown, dataId}) => {

    const classesButton = classNames({
        'lv-button': true,
        [`lv-button_${variant}_${color}`]: true,
        [`lv-button_${size}`]: size,
        'lv-button_icon_only': (startIcon || endIcon) && !children,
        'lv-button_full_width': fullWidth,
        'lv-button_with-icons': startIcon ||endIcon,
        [className || ""]: className
    })

    return (
        <button
            className={classesButton}
            disabled={disabled}
            aria-label={ariaLabel}
            onClick={onClick}
            onMouseDown={onMouseDown}
            data-id={dataId}
        >
            {startIcon}{children}{endIcon}
        </button>
    )
}

export default Button;