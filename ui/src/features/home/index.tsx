import { ChartCard } from "@/features/home/components/chart-card";
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
import { useGetTreeSourcesQuery } from "@/api/sources/getTreeSources";

export function Home() {
    const { data } = useGetTreeSourcesQuery()

    return (
        <LogsProvider>
            <Header>
                <div className="me-auto" />
                <TimeRangePicker />
                <DebugToggle />
                <ThemeSwitch />
            </Header>

            <Main className='p-2 space-y-4 flex flex-row items-center justify-between'>
                <div className={"flex-1 min-h-0 p-2 flex flex-col gap-4"}>
                    <ResizablePanelGroup className="rounded-lg border">
                        <ResizablePanel defaultSize="15%" minSize="10%">
                            <SourceGroupTree nodes={data ?? []} />
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        <ResizablePanel defaultSize="85%" minSize="50%">
                            <div className="p-2 space-y-2">
                                <Query />
                                <ChartCard />
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                    <LogsCard />
                </div>
            </Main>
        </LogsProvider >
    )
}