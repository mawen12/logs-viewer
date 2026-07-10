import { ChartCard } from "@/features/home/components/chart-card";
import { MixedLogsCard } from "@/features/home/components/mixed-logs-card";
import { Query } from "./components/query";
import { LogsCard } from "./components/logs-card";
import type { HTMLAttributes } from "node_modules/@types/react";
import { cn } from "@/lib/utils";

export type HomeProps = HTMLAttributes<HTMLDivElement> & {

}

export function Home({className}: HomeProps) {
    return (
        <div className={cn("flex-1 min-h-0 p-2 flex flex-col gap-4", className)}>
            {/* <QueryCard /> */}
            <Query />
            <ChartCard />
            <MixedLogsCard />
            <LogsCard/>
        </div>
    )
}