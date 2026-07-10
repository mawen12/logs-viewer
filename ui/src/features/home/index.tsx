import { ChartCard } from "@/features/home/components/chart-card";
import { MixedLogsCard } from "@/features/home/components/mixed-logs-card";
import { Query } from "./components/query";
import { LogsCard } from "./components/logs-card";

export function Home() {
    return (
        <div className="flex-1 min-h-0 p-2 flex flex-col gap-4">
            {/* <QueryCard /> */}
            <Query />
            <ChartCard />
            <MixedLogsCard />
            <LogsCard/>
        </div>
    )
}