import { CheckOutlined, DeleteOutlined, DoneOutlined, ErrorOutlined, InfoOutlined, WarningOutlined } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/compat";

export const SnackbarContext = createContext({
    showInfoMessage: () => {}
})

export const useSnack = () => useContext(SnackbarContext);

const icons = {
    success: <DoneOutlined/>,
    error: <ErrorOutlined/>,
    warning: <WarningOutlined/>,
    info: <InfoOutlined/>
}

export const SnackbarProvider = ({children}) => {
    const [snack, setSnack] = useState({text: "", type: "info"});
    const [open, setOpen] = useState(false);
    const [infoMessage, setInfoMessage] = useState(null);

    const handleClose = () => {
        setInfoMessage(null);
        setOpen(false);
    }

    useEffect(() => {
        if (!infoMessage) return;
        setSnack({
            ...infoMessage,
            key: Date.now(),
        });
        setOpen(true);

        const timeout = setTimeout(handleClose, infoMessage.timeout || 4000);

        return () => clearTimeout(timeout);
    }, [infoMessage])

    return (
        <SnackbarContext.Provider value={{ showInfoMessage: setInfoMessage}}>
            {open && 
                <Alert severity={snack.type} onClose={handleClose}>
                    {snack.text}
                </Alert>
            }
            
            {children}

        </SnackbarContext.Provider>
    )
}