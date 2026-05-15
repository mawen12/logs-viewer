import { ChartCard } from "../business/ChartCard";
import { QueryCard } from "../business/QueryCard";
import { StickyLogsCard } from "../business/StickyLogsCard";

export function Main() {

    return (
        <main className="flex-1 min-h-0 p-2 flex flex-col gap-2">
            <QueryCard/>
            <ChartCard/>
            <StickyLogsCard/>
        </main>
    )
}