import { LogsTabs } from "../business/LogsTabs";
import { QueryCard } from "../business/QueryCard";

export function Main() {

    return (
        <main className="flex-1 min-h-0 overflow-hidden p-2 flex flex-col gap-2">
            <QueryCard/>
            <LogsTabs/>
        </main>
    )
}