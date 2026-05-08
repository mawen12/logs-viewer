import { useEffect, useState } from "preact/compat";
import "./style.scss";
import classNames from "classnames";
import { ArrowDownIcon } from "../icons";

const Accordion = ({defaultExapned = false, onChange, title, children}) => {
    const [isOpen, setIsOpen] = useState(defaultExapned)

    const toggleOpen = () => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            return;
        }

        setIsOpen((prev) => {
            const newState = !prev;
            onChange && onChange(newState);
            return newState;
        });
    }

    useEffect(() => {
        setIsOpen(defaultExapned)
    }, [defaultExapned]);

    return (
        <>
            <header 
                className={classNames({
                    'lv-accordion-header': true,
                })} 
                onClick={toggleOpen}
            >
                {title}
                <div
                    className={classNames({
                        'lv-accordion-header__arrow': true,
                        'lv-accordion-header__arrow_open': isOpen,
                    })}                    
                >
                    <ArrowDownIcon/>
                </div>
            </header>

            {isOpen && (
                <section
                    className={classNames({
                        'lv-accordion-section': true,
                    })}
                    key="content"
                >
                    {children}
                </section>
            )}
        </>
    )
}

export default Accordion;