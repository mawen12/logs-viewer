import { createContext, useContext } from "react";
import type { SnackbarItem } from "./snackbar-provider";

export type SnackbarContextType = {
    showInfoMessage: (item: SnackbarItem) => void
}

export const SnackbarContext = createContext<SnackbarContextType>({
    showInfoMessage: () => { }
});

export const useSnack = (): SnackbarContextType => {
   const context = useContext(SnackbarContext);
   
   if (context === undefined) {
        throw new Error("useSnack must be used within a SnackbarProvider")
    }

   return context
}