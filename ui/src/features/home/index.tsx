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

export function Home() {
    return (
        <LogsProvider>
            <Header>
                <div className="me-auto"/>
                <TimeRangePicker/>
                <DebugToggle/>
                <ThemeSwitch />
            </Header>

            <Main className='p-2 space-y-4 flex flex-row items-center justify-between'>
                <div className={"flex-1 min-h-0 p-2 flex flex-col gap-4"}>
                    {/* <QueryCard /> */}
                    <Query />
                    <ChartCard />
                    <MixedLogsCard />
                    <LogsCard/>
                </div>
            </Main>
        </LogsProvider>
    )
}