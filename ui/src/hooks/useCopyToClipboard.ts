import { useSnack } from "@/contexts/SnackbarProvider";
import type { ReactNode } from "node_modules/@types/react";

export function useCopyToClipboard() {
    const { showInfoMessage } = useSnack();

    return async(text: string, msgInfo: string | ReactNode) => {
        if (!navigator?.clipboard) {
            showInfoMessage({
                text: "Clipboard API not supported",
                type: "error",
                timeout: 20000,
            })
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            if (msgInfo) {
                showInfoMessage({
                    text: msgInfo,
                    type: "success"
                })
            }
            return true;
        } catch (err) {
            if (err instanceof Error) {
                showInfoMessage({
                    text: `${err.name}: ${err.message}`,
                    type: "error",
                })
            }

            console.warn("Copy failed", err);
            return false;
        }
    }
}