import { ChartCard } from "@/features/home/components/chart-card";
import { MixedLogsCard } from "@/features/home/components/mixed-logs-card";
import { Query } from "./components/query";
import { LogsCard } from "./components/logs-card";
import { LogsProvider } from "./components/logs-provider";
import { Main } from "@/components/layout/main";
import { Header } from "@/components/layout/header";
import { ThemeSwitch } from "@/components/theme-switch";
import { TimeRangePicker } from "@/components/time-range/time-range-picker";
import { DebugToggle } from "@/components/debug-toggle";
import { SourceGroupTree } from "./components/source-group-tree";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export function Home() {
    return (
        <LogsProvider>
            <Header>
                <div className="me-auto" />
                <TimeRangePicker />
                <DebugToggle />
                <ThemeSwitch />
            </Header>

            <Main className='p-2 space-y-4 flex flex-row items-center justify-between'>
                <ResizablePanelGroup className="rounded-lg border">
                    <ResizablePanel defaultSize="15%" minSize="10%">
                        <div className="h-full overflow-auto p-2">
                            <SourceGroupTree nodes={[{
                                id: "1", label: 'Default Group', type: 'group', children: [
                                    { id: '2', label: 'Default Souce1', parentId: "1", type: 'source' },
                                    { id: '3', label: 'Default Souce2', parentId: "1", type: 'source' }]
                            }]} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize="85%" minSize="50%">
                        <div className={"flex-1 min-h-0 p-2 flex flex-col gap-4"}>
                            {/* <QueryCard /> */}
                            <Query />
                            <ChartCard />
                            <MixedLogsCard />
                            <LogsCard />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </Main>
        </LogsProvider>
    )
}