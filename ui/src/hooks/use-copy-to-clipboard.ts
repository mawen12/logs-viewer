import { useSnack } from "@/contexts/snackbar-provider";
import type { ReactNode } from "react";

export function useCopyToClipboard() {
    const { showInfoMessage } = useSnack();

    return async(text: string, msgInfo: string | ReactNode) => {
        if (!navigator?.clipboard) {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);

                return successful;
            } catch (err) {
                console.warn('Copy failed', err);
                return false;
            }
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