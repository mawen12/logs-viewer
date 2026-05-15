import { useLogStore } from "@/store/useLogStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CardLogs } from "./CardLogs";
import { useMemo } from "react";

export function LogsTabs() {

    const { messageComposes } = useLogStore();

    const defaultValue = useMemo(() => {
        return messageComposes[0]?.stream || "";
    }, [messageComposes])

    return (
        <>
        { messageComposes.length > 0 &&  (
            <Tabs defaultValue={defaultValue} className="h-full min-h-0">
                <TabsList>
                    {messageComposes.map((messageCompose) => (
                        <TabsTrigger key={messageCompose.stream} value={messageCompose.stream}>{`${messageCompose.stream}<${messageCompose.logs?.length || 0}>`}</TabsTrigger>
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