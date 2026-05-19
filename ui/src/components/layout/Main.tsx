import { MixedLogsCard } from "../business/MixedLogsCard";
import { QueryCard } from "../business/QueryCard";

export function Main() {

    return (
        <main className="flex-1 min-h-0 p-2 flex flex-col gap-2">
            <QueryCard/>
            {/* <ChartCard/> */}
            <MixedLogsCard/>
        </main>
    )
}