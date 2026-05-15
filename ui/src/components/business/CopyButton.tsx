import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useLogStore } from "@/store/useLogStore";
import { IconClipboardCheck, IconCopy } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function CopyButton() {
    const copyToClipboard = useCopyToClipboard();
    const [copied, setCopied] = useState<boolean>(false);
    const { messageComposes } = useLogStore();

    const isEmpty = useMemo(() => {
        if (!messageComposes) return true;

        for (let i = 0; i < messageComposes.length; i++) {
            if (messageComposes[i]?.logs?.length > 0) {
                return false
            }
        }
        return true
    }, [messageComposes])

    const data = useMemo(() => {
        if (!messageComposes) return "";

        const arr = [];
        for (let i = 0; i < messageComposes.length; i++) {
            const messageCompose = messageComposes[i];
            const stream = messageCompose.stream;
            if (messageCompose.logs?.length > 0) {
                arr.push(`############################################`);
                arr.push(`## ${stream}`);
                arr.push(`############################################`);

                for (let j = 0; j < messageCompose.logs.length; j++) {
                    const log = messageCompose.logs[j];
                    arr.push(log.message.replace(/\r\n/g, "\n").replace(/\0/g, "\n"));
                }
            }
        }

        return arr.join("\n");
    }, [messageComposes])

    const handleCopyLog = async () => {
        try {
            const isCopied = await copyToClipboard(data, "");
            if (isCopied) setCopied(true);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [copied])

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleCopyLog} disabled={copied || isEmpty}>
                    {copied ? <IconClipboardCheck /> : <IconCopy />}
                </Button>

            </TooltipTrigger>
            <TooltipContent side="bottom">
                Copy logs
            </TooltipContent>
        </Tooltip>
    )
}