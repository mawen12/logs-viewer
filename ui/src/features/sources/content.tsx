import { useSources } from "./components/sources-provider";
import { SourcesTable } from "./components/sources-table";
import type { HTMLAttributes } from "react";

export type SourcesContentProps = HTMLAttributes<HTMLDivElement> 

export function SourcesContent({className, ...props}: SourcesContentProps) {
    const { data = [] } = useSources()

    return (
        <div className={className} {...props}>
        <SourcesTable data={data} />
        </div>
    )
}