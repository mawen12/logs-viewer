import { useLogsState } from "@/contexts/LogsStateProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CardLogs } from "./CardLogs";

export function LogsTabs() {

    const { messageComposes } = useLogsState();

    return (
        <>
        { messageComposes &&  (
            <Tabs className="h-full min-h-0">
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