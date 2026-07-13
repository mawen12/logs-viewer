import { useSources } from "./components/sources-provider";
import { SourcesTable } from "./components/sources-table";

export function SourcesContent() {
    const { data = [] } = useSources()

    return (
        <SourcesTable data={data} />
    )
}