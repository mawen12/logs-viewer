import { useGetTreeSourcesQuery } from "@/api/sources/getTreeSources";
import { DebugToggle } from "@/components/debug-toggle";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ThemeSwitch } from "@/components/theme-switch";
import { TimeRangePicker } from "@/components/time-range/time-range-picker";
import { ChartCard } from "@/features/home/components/chart-card";
import { LogsCard } from "./components/logs-card";
import { LogsProvider } from "./components/logs-provider";
import { Query } from "./components/query";
import { SourceGroupButton } from "./components/source-group-button";

export function Home() {
    return (
        <LogsProvider>
            <Header>
                <SourceGroupButton />
                <div className="me-auto" />
                <TimeRangePicker />
                <DebugToggle />
                <ThemeSwitch />
            </Header>

            <Main className='p-2 space-y-4 flex flex-row items-center justify-between'>
                <div className={"flex-1 min-h-0 p-2 flex flex-col gap-4"}>
                    <Query />
                    <ChartCard />
                    <LogsCard />
                </div>
            </Main>
        </LogsProvider >
    )
}