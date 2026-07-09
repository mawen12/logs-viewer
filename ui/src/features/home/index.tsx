import { ChartCard } from "@/features/home/components/chart-card";
import { MixedLogsCard } from "@/features/home/components/mixed-logs-card";
import { QueryCard } from "@/features/home/components/query-card";
import { Query } from "./components/query";

export function Home() {
    return (
        <div className="flex-1 min-h-0 p-2 flex flex-col gap-2">
            {/* <QueryCard /> */}
            <Query/>
            <ChartCard />
            <MixedLogsCard />
        </div>
    )
}