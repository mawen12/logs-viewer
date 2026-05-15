import { useLogStore } from "@/store/useLogStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CardLogs } from "./CardLogs";
import { useMemo } from "react";

export function LogsTabs() {

    const { messageComposes } = useLogStore();

    const defaultValue = useMemo(() => {
        for (let i = 0; i < messageComposes.length; i++) {
            if (messageComposes[i].logs && messageComposes[i].logs?.length > 0) {
                return messageComposes[i].stream;
            }
        }
        return "";
    }, [messageComposes])

    return (
        <>
            {messageComposes.length > 0 && (
                <Tabs defaultValue={defaultValue}>
                    <TabsList>
                        {messageComposes.map((messageCompose) => (
                            <TabsTrigger key={messageCompose.stream} value={messageCompose.stream} disabled={!messageCompose.logs || messageCompose.logs.length === 0}>
                                {`${messageCompose.stream}<${messageCompose.logs?.length || 0}>`}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {messageComposes.map((messageCompose) => (
                        <TabsContent key={messageCompose.stream} value={messageCompose.stream} className="h-full min-h-0">
                            <CardLogs logs={messageCompose.logs || []} />
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </>
    )
}